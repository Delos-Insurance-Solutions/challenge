import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

// Addresses Controller
@Controller('addresses')
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) {}

    /**
     * Create a new address.
     *
     * @param dto - Data Transfer Object containing the address details
     * @returns The created address
     * @example
     * const address = await controller.create({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });
     */
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