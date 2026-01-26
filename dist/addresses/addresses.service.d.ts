import { Address } from './address.model';
export declare class AddressesService {
    private readonly addressModel;
    private readonly logger;
    constructor(addressModel: typeof Address);
    create(addressText: string): Promise<any>;
    findAll(): Promise<any>;
    findById(id: string): Promise<any>;
}
