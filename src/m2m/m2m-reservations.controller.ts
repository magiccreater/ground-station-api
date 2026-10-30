import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RequireScopes, ScopesGuard } from '../auth/scopes.guard';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { ReservationsService } from '../reservations/reservations.service';

@Controller('m2m/v1/reservations')
@UseGuards(ScopesGuard)                       // every route here needs a valid token
export class M2mReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Get()
  @RequireScopes('reservations:read')
  list(@Query('stationId') stationId: string) {
    return this.service.findByStation(stationId);
  }

  @Post()
  @RequireScopes('reservations:write')
  create(@Body() dto: CreateReservationDto, @Req() req: { client: string }) {
    return this.service.create(dto, req.client);   // bookedBy = "mission-planner"
  }
}