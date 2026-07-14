import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItineraryDto: CreateItineraryDto, @Request() req) {
    return this.itinerariesService.create(createItineraryDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.itinerariesService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.itinerariesService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItineraryDto: UpdateItineraryDto) {
    return this.itinerariesService.update(id, updateItineraryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GUIA)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itinerariesService.remove(id);
  }
}
