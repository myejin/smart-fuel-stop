import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../notification/notification.dto';
import { NotificationService } from '../notification/notification.service';
import { Position } from '../vo/position.vo';
import { StationBrand } from '../vo/station-brand.vo';
import { GetRecommendedStationDto, StationDto } from './fuel-station.dto';
import { OpinetService, OpinetSortBy } from './opinet.service';

@Injectable()
export class FuelStationService {
  private readonly RECOMMENDED_STATION_COUNT = 5;
  private readonly NEARBY_STATION_RADIUS_M = 5000;
  private readonly SAFE_DISTANCE_KM = 30;

  constructor(
    private readonly opinetService: OpinetService,
    private readonly notificationService: NotificationService,
  ) {}

  async getRecommendedStations(
    dto: GetRecommendedStationDto,
  ): Promise<StationDto[]> {
    const nearbyStations = await this.getNearbyStations(dto);

    await this.notifyGettingRecommendedStations(
      nearbyStations,
      dto.remainingDistanceKm,
    );

    return nearbyStations;
  }

  private async getNearbyStations(
    dto: GetRecommendedStationDto,
  ): Promise<StationDto[]> {
    const isSafeDistance = this.SAFE_DISTANCE_KM <= dto.remainingDistanceKm;

    const fuelTypeValue = dto.fuelType.getValue();
    if (fuelTypeValue) {
      const opinetItems = await this.opinetService.getNearbyStations(
        dto.currentPosition,
        dto.fuelType.toOpinetType(),
        isSafeDistance ? OpinetSortBy.Price : OpinetSortBy.Distance,
        this.RECOMMENDED_STATION_COUNT,
        this.NEARBY_STATION_RADIUS_M,
      );

      return opinetItems.map((item) => {
        const position = new Position();
        position.setByXY(item.GIS_X_COOR, item.GIS_Y_COOR);
        const stationBrand = new StationBrand();
        stationBrand.setByOpinet(item.POLL_DIV_CD);

        return new StationDto({
          stationBrand: stationBrand,
          stationName: item.OS_NM,
          fuelType: dto.fuelType,
          fuelPrice: item.PRICE,
          position,
        });
      });
    }
    throw new Error(`Unsupported fuel type: ${fuelTypeValue}`);
  }

  private async notifyGettingRecommendedStations(
    stations: StationDto[],
    remainingDistanceKm: number,
  ): Promise<any> {
    // TODO: promise?

    const hasEnoughStations = stations.length >= this.RECOMMENDED_STATION_COUNT;
    const hasNoStation = stations.length === 0;

    const notificationType: CreateNotificationDto['type'] = hasEnoughStations
      ? 'INFO'
      : hasNoStation && remainingDistanceKm < this.SAFE_DISTANCE_KM
        ? 'EMERGENCY'
        : 'WARNING';

    return this.notificationService.createNotification(
      new CreateNotificationDto({
        type: notificationType,
        message: `${stations.length} nearby gas stations found.`,
      }),
    );
  }
}
