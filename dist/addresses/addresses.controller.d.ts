import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    create(dto: CreateAddressDto): Promise<import("./address.model").Address>;
    list(): Promise<import("./address.model").Address[]>;
    getById(id: string): Promise<import("./address.model").Address>;
}
