import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/notification/notification.module';
import { FuelStationService } from './fuel-station.service';
import { OpinetService } from './opinet.service';

@Module({
  imports: [NotificationModule],
  providers: [FuelStationService, OpinetService],
  exports: [FuelStationService],
})
export class FuelStationModule {}
