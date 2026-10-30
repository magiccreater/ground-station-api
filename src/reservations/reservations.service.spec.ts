import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { ReservationsService } from './reservations.service';
import { LiveGateway } from '../live/live.gateway';

describe('ReservationsService', () => {
  let service: ReservationsService;
  const repo = {
    findOne: jest.fn(),
    create: jest.fn((data) => data),
    save: jest.fn(async (data) => ({ id: 1, ...data })),
    find: jest.fn(),
  };

  const live = {
    broadcast: jest.fn(),
  };


  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [ReservationsService, 
                  { provide: getRepositoryToken(Reservation), useValue: repo }, 
                  { provide: LiveGateway, useValue: live }],
    }).compile();
    service = moduleRef.get(ReservationsService);
  });

  const dto = {
    stationId: 'MAHIA-1',
    missionName: 'Electron F60',
    startsAt: '2026-11-01T10:00:00Z',
    endsAt: '2026-11-01T11:00:00Z',
  };

  it('saves a reservation when the slot is free', async () => {
    repo.findOne.mockResolvedValue(null);
    const result = await service.create(dto);
    expect(result.id).toBe(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('rejects an overlapping booking with 409', async () => {
    repo.findOne.mockResolvedValue({ id: 7, missionName: 'Photon P3' });
    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('rejects an end time before the start time with 400', async () => {
    await expect(service.create({ ...dto, endsAt: '2026-11-01T09:00:00Z' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});