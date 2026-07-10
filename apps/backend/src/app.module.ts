import { Module } from '@nestjs/common';
import { PlacesModule } from './modules/places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PlacesModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
