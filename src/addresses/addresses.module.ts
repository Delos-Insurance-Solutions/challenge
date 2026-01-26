import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';
import { GoogleGeocodingService } from '../integrations/google/geocoding.service';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [
      AddressesService,
    GoogleGeocodingService
  ],
})
export class AddressesModule {}