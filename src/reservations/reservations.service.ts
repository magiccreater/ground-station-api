import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './reservation.entity';
import { LiveGateway } from '../live/live.gateway';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservations: Repository<Reservation>,
    private readonly live: LiveGateway,
  ) {}

  findByStation(stationId: string): Promise<Reservation[]> {
    return this.reservations.find({ where: { stationId }, order: { startsAt: 'ASC' } });
  }

  async create(dto: CreateReservationDto, bookedBy = 'web-ui'): Promise<Reservation> {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    // Two windows overlap when: existing.start < new.end AND existing.end > new.start
    const clash = await this.reservations.findOne({
      where: { stationId: dto.stationId, startsAt: LessThan(endsAt), endsAt: MoreThan(startsAt) },
    });
    if (clash) {
      throw new ConflictException(`Station ${dto.stationId} is already booked by ${clash.missionName}`);
    }

    const saved = await this.reservations.save(this.reservations.create({ ...dto, startsAt, endsAt, bookedBy }));
    this.live.broadcast({ type: 'reservation.created', data: saved });
    return saved;
  }
}