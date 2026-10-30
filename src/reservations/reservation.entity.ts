import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservations')
@Index(['stationId', 'startsAt'])
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stationId: string;

  @Column()
  missionName: string;

  @Column({ type: 'datetime' })
  startsAt: Date;

  @Column({ type: 'datetime' })
  endsAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'web-ui' })
  bookedBy: string;
}