import { Test } from '@nestjs/testing';
import {
  OpinetFuelType,
  OpinetService,
  OpinetSortBy,
} from '../../src/fuel-station/opinet.service';
import { Position } from '../../src/vo/position.vo';

describe('OpinetService', () => {
  let opinetService: OpinetService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [OpinetService],
    }).compile();

    opinetService = module.get<OpinetService>(OpinetService);
  });

  describe('getNearbyStations', () => {
    it.skip('추천 주유소 목록을 조회할 수 있다', async () => {
      const dto = {
        position: new Position({ lat: 37.5665, lng: 126.978 }),
        fuelType: OpinetFuelType.Default,
        sortBy: OpinetSortBy.Price,
        limit: 5,
        radiusM: 5000,
      };

      const result = await opinetService.getNearbyStations(
        dto.position,
        dto.fuelType,
        dto.sortBy,
        dto.limit,
        dto.radiusM,
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(dto.limit);
    });
  });
});
