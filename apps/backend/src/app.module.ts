import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlacesModule } from './modules/places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [PrismaModule, PlacesModule],
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
