import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { FuelStationModule } from './fuel-station/fuel-station.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, FuelStationModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
