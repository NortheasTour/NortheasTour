import { Module } from '@nestjs/common';
import { PlacesModule } from './modules/places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [PrismaModule, PlacesModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      DATABASE_URL: Joi.string().required(),
      JWT_SECRET: Joi.string().required().min(32),
      JWT_EXPIRES_IN: Joi.string().pattern(/^\d+[smhd]$/).required(),
    }),
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
