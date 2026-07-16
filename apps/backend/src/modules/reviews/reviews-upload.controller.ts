import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type { File as MulterFile } from 'multer';
import { existsSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import {
  MAX_FILE_SIZE_BYTES,
  REVIEWS_PHOTOS_STORAGE_DIR,
  reviewPhotoMulterOptions,
} from './config/multer.config';
import { UploadPhotoResponseDto } from './dto/upload-photo-response.dto';
import { isValidImageSignature } from './utils/image-signature.util';
import { MulterExceptionFilter } from './filters/multer-exception.filter';

@Controller('reviews/photos')
export class ReviewsUploadController {
  /**
   * POST /reviews/photos
   * Recebe multipart/form-data com o campo "photo".
   */
  @Post()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(FileInterceptor('photo', reviewPhotoMulterOptions))
  async uploadReviewPhoto(
    @UploadedFile(
      // Segunda camada de validação (além do fileFilter do multer),
      // usando os validadores nativos do Nest. Garante que, mesmo que
      // um outro ponto de entrada reutilize este pipe, a regra é a mesma.
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i })
        .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES })
        .build({
          // Critério de aceite: presença é obrigatória.
          fileIsRequired: true,
          errorHttpStatusCode: 400,
        }),
    )
    file: MulterFile,
  ): Promise<UploadPhotoResponseDto> {
    // Defesa em profundidade: confere a assinatura binária real do arquivo,
    // pois mimetype/extensão podem ser forjados pelo cliente.
    const fileBuffer = readFileSync(file.path);
    if (!isValidImageSignature(fileBuffer)) {
      throw new BadRequestException(
        'O conteúdo do arquivo não corresponde a uma imagem válida.',
      );
    }

    // IMPORTANTE: a resposta nunca deve conter file.path (caminho físico
    // interno do servidor). Expomos apenas um identificador e uma URL
    // servida por rota própria.
    return {
      fileId: file.filename,
      url: `/reviews/photos/${file.filename}`,
      sizeInBytes: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * GET /reviews/photos/:fileId
   * Serve o arquivo sem nunca expor o caminho físico do servidor na resposta.
   */
  @Get(':fileId')
  getReviewPhoto(@Param('fileId') fileId: string, @Res() res: Response) {
    // basename() elimina qualquer tentativa de path traversal (ex.: ../../etc/passwd)
    const safeFileId = basename(fileId);
    const filePath = join(REVIEWS_PHOTOS_STORAGE_DIR, safeFileId);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Arquivo não encontrado.');
    }

    return res.sendFile(safeFileId, { root: REVIEWS_PHOTOS_STORAGE_DIR });
  }
}
