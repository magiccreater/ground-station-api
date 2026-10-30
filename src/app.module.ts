import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { Reservation } from './reservations/reservation.entity';
import { ReservationsModule } from './reservations/reservations.module';
import { LiveModule } from './live/live.module';
import { AuthModule } from './auth/auth.module';
import { M2mReservationsController } from './m2m/m2m-reservations.controller';



@Module({
  imports: [TasksModule,
            TypeOrmModule.forRoot({
              type: 'better-sqlite3',
              database: 'ground-station.sqlite',
              entities: [Reservation],
              synchronize: true, // dev only. Use migrations in production.
            }),
            ReservationsModule,
            LiveModule,
            AuthModule
  ],
  controllers: [AppController,M2mReservationsController],
  providers: [AppService],
})
export class AppModule {}
