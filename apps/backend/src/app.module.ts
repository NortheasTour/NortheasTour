import { Module } from '@nestjs/common';
import { PlacesModule } from './modules/places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';

@Module({
  imports: [PrismaModule, PlacesModule, UsersModule, ItinerariesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
