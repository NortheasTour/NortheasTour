import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do ponto turístico é obrigatório.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  city!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
