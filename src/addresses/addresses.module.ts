import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}