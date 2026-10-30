import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { LiveModule } from '../live/live.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), LiveModule, AuthModule],   // makes Repository<Reservation> injectable
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],  // makes ReservationsService injectable in other modules
})
export class ReservationsModule {}