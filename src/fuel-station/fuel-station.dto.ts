import { FuelType } from 'src/vo/fuel-type.vo';
import { Position } from 'src/vo/position.vo';
import { StationBrand } from 'src/vo/station-brand.vo';

export class GetRecommendedStationDto {
  fuelType: FuelType;
  currentPosition: Position;
  remainingDistanceKm: number;

  constructor(partial: Partial<GetRecommendedStationDto>) {
    Object.assign(this, partial);
  }
}

export class StationDto {
  stationBrand: StationBrand;
  stationName: string;
  fuelType: FuelType;
  fuelPrice: number;
  position: Position;

  constructor(partial: Partial<StationDto>) {
    Object.assign(this, partial);
  }
}
