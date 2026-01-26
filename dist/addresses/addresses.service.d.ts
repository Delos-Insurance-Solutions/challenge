import { Address } from './address.model';
import { GoogleGeocodingService } from '../integrations/google/geocoding.service';
import { FirmsService } from "../integrations/firms/firms.service";
export declare class AddressesService {
    private readonly addressModel;
    private readonly googleGeocodingService;
    private readonly firmsService;
    private readonly logger;
    constructor(addressModel: typeof Address, googleGeocodingService: GoogleGeocodingService, firmsService: FirmsService);
    create(addressText: string): Promise<Address>;
    findAll(): Promise<Address[]>;
    findById(id: string): Promise<Address>;
}
