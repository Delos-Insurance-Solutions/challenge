import {
    Injectable,
    NotFoundException,
    Logger
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';
import { normalizeAddress } from './address-normalize';
import { GoogleGeocodingService } from '../integrations/google/geocoding.service';
import {FirmsService} from "../integrations/firms/firms.service";

//Addresses Service
@Injectable()
export class AddressesService {
    private readonly logger = new Logger(AddressesService.name);

    constructor(
        @InjectModel(Address) private readonly addressModel: typeof Address,
        private readonly googleGeocodingService: GoogleGeocodingService,
        private readonly firmsService: FirmsService,

    ) {}

    /**
     * Create a new address in the database.
     *
     * @param addressText - The address string
     * @returns The created address
     * @example
     * const address = await addressModel.create({ address: "" });
     */
    async create(addressText: string) {
        const addressNormalized = normalizeAddress(addressText);

        const existing = await this.addressModel.findOne({ where: { addressNormalized } });
        if (existing) {
            this.logger.log(`cache hit for address=${addressNormalized} id=${existing.id}`);
            return existing;
        }

        this.logger.log(`cache miss, calling Google for address=${addressNormalized}`);
        const { lat, lng, raw } = await this.googleGeocodingService.geocode(addressText);

        const address = await this.addressModel.create({
            address: addressText,
            addressNormalized,
            latitude: lat,
            longitude: lng,
            geocodeRaw: raw,
            wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 },
        } as any);

        this.logger.log(`calling FIRMS for lat=${address.latitude} lng=${address.longitude}`);
        const wildfire = await this.firmsService.fetchWildfires(address.latitude!, address.longitude!);

        address.wildfireData = wildfire as any;
        address.wildfireFetchedAt = new Date();
        this.logger.log(`final wildfireData.count=${address.wildfireData.count}`);

        await address.save();

        this.logger.log(`saved address id=${address.id}`);
        return address;
    }
    
    /**
     * List all addresses with pagination.
     * @param limit - Maximum number of items to return
     * @param offset - Offset of the first item to return
     * @returns
     * @example
     *     "total": 1,
     *     "limit": 20,
     *     "offset": 0,
     *     "items": [...addresses]
     */
    async findAllPaginated({ limit, offset }: { limit: number; offset: number }) {
        const { rows, count } = await this.addressModel.findAndCountAll({
            attributes: ['id', 'address', 'latitude', 'longitude'],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        this.logger.log(`Found a total of ${count} Addresses with limit=${limit} offset=${offset}`);
        
        return {
            total: count,
            limit,
            offset,
            items: rows,
        };
    }

    /**
     * Find an address by ID.
     * @param id - The address ID
     * @returns The address
     */
    async findById(id: string) {
        const address = await this.addressModel.findByPk(id);
        if (!address) {
            this.logger.log(`Address not found id=${id}`);
            throw new NotFoundException('Address not found');
        }
        return address;
    }
}
