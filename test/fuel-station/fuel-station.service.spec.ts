import { Test } from '@nestjs/testing';
import {
  GetRecommendedStationDto,
  StationDto,
} from '../../src/fuel-station/fuel-station.dto';
import { FuelStationService } from '../../src/fuel-station/fuel-station.service';
import {
  OpinetService,
  OpinetSortBy,
  OpinetStation,
} from '../../src/fuel-station/opinet.service';
import { NotificationService } from '../../src/notification/notification.service';
import { FuelType } from '../../src/vo/fuel-type.vo';
import { Position } from '../../src/vo/position.vo';

describe('FuelStationService', () => {
  let fuelStationService: FuelStationService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        FuelStationService,
        {
          provide: OpinetService,
          useValue: {
            getNearbyStations: jest
              .fn()
              .mockImplementation((_pos, _fuelType, sortBy) => {
                if (sortBy === OpinetSortBy.Distance) {
                  return Promise.resolve([
                    getOpinetStationDummy({ OS_NM: 'A' }),
                  ]);
                } else if (sortBy === OpinetSortBy.Price) {
                  return Promise.resolve([
                    getOpinetStationDummy({ OS_NM: 'B' }),
                  ]);
                }
                return Promise.resolve([getOpinetStationDummy()]);
              }),
          },
        },
        {
          provide: NotificationService,
          useValue: { createNotification: jest.fn() },
        },
      ],
    }).compile();

    fuelStationService = module.get<FuelStationService>(FuelStationService);
  });

  function getOpinetStationDummy(customData = {}): OpinetStation {
    return {
      UNI_ID: 'A0011826',
      POLL_DIV_CD: 'RTX',
      OS_NM: '㈜에이치앤디이 만남의광장주유소',
      PRICE: 1611,
      DISTANCE: 4763.2,
      GIS_X_COOR: 315535.76499,
      GIS_Y_COOR: 540150.38545,
      ...customData,
    };
  }

  describe('getRecommendedStations', () => {
    it('StationDto 타입의 주유소 목록을 조회할 수 있다', async () => {
      const dto = new GetRecommendedStationDto({
        fuelType: new FuelType(1),
        currentPosition: new Position({ lat: 37.5665, lng: 126.978 }),
        remainingDistanceKm: 50,
      });

      const result = await fuelStationService.getRecommendedStations(dto);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0] instanceof StationDto).toBe(true);
    });

    it('안전주행 가능한 범위(30km 밖)에 있다면 가격 기준으로 주유소를 추천한다', async () => {
      const dto = new GetRecommendedStationDto({
        fuelType: new FuelType(1),
        currentPosition: new Position({ lat: 37.5665, lng: 126.978 }),
        remainingDistanceKm: 40,
      });

      const result = await fuelStationService.getRecommendedStations(dto);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]?.stationName).toBe('B');
    });

    it('안전주행 가능한 범위(30km 밖)가 아니라면 거리 기준으로 주유소를 추천한다', async () => {
      const dto = new GetRecommendedStationDto({
        fuelType: new FuelType(1),
        currentPosition: new Position({ lat: 37.5665, lng: 126.978 }),
        remainingDistanceKm: 20,
      });

      const result = await fuelStationService.getRecommendedStations(dto);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]?.stationName).toBe('A');
    });
  });
});
