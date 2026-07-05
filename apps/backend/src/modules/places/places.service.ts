import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FindAllPlacesQueryDto } from './dto/find-all-places-query.dto';

@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto) {
    return this.prisma.place.create({
      data: createPlaceDto,
    });
  }

  async findAll(query: FindAllPlacesQueryDto) {
    const { category, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.place.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.place.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const place = await this.prisma.place.findUnique({ where: { id } });
    if (!place) {
      throw new NotFoundException(
        `Ponto turístico com ID ${id} não foi encontrado.`,
      );
    }
    return place;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    await this.findOne(id); 
    return this.prisma.place.update({
      where: { id },
      data: updatePlaceDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.place.delete({ where: { id } });
  }
}
