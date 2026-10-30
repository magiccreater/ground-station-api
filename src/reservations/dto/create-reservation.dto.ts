import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateReservationDto {
  @IsString() @IsNotEmpty()
  stationId: string;

  @IsString() @IsNotEmpty() @MaxLength(100)
  missionName: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;
}