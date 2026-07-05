import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    if (process.env.DATABASE_URL) {
      await this.$connect();
    } else {
      console.warn('DATABASE_URL não definido — pulando conexão com o Prisma.');
    }
  }
}
