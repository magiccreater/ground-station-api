import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Get()
  list(@Query('stationId') stationId: string) {
    return this.service.findByStation(stationId);
  }

  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.service.create(dto);
  }
}