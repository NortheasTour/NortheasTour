import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';

@Injectable()
export class ItinerariesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItineraryDto: CreateItineraryDto) {
    const { title, description, userId, placeIds } = createItineraryDto;
    
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) throw new NotFoundException('Usuário criador não encontrado.');

    return this.prisma.itinerary.create({
      data: {
        title,
        description,
        userId, // Vincula o criador
        places: {
          connect: placeIds.map((id) => ({ id })), // Vincula os múltiplos pontos turísticos pelos IDs
        },
      },
      include: {
        places: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.itinerary.findMany({
      include: {
        places: true,
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        places: true,
        user: { select: { id: true, name: true } },
      },
    });

    if (!itinerary) {
      throw new NotFoundException(`Roteiro com ID ${id} não encontrado.`);
    }
    return itinerary;
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    await this.findOne(id);
    const { title, description, placeIds } = updateItineraryDto;

    return this.prisma.itinerary.update({
      where: { id },
      data: {
        title,
        description,
        ...(placeIds && {
          places: {
            set: placeIds.map((placeId) => ({ id: placeId })),
          },
        }),
      },
      include: { places: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.itinerary.delete({ where: { id } });
  }
}