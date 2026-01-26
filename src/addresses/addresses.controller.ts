import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) {}

    @Post()
    async create(@Body() dto: CreateAddressDto) {
        return this.addressesService.create(dto.address);
    }

    @Get()
    async list() {
        return this.addressesService.findAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.addressesService.findById(id);
    }
}
