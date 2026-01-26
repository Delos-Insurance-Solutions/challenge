import { Address } from './address.model';
export declare class AddressesService {
    private readonly addressModel;
    private readonly logger;
    constructor(addressModel: typeof Address);
    create(addressText: string): Promise<Address>;
    findAll(): Promise<Address[]>;
    findById(id: string): Promise<Address>;
}
