import {
    Injectable,
    NotFoundException,
    Logger,
    UnprocessableEntityException,
    InternalServerErrorException
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
        this.logger.log(`cache hit for address=${addressNormalized}`);

        const existing = await this.addressModel.findOne({
            where: { addressNormalized },
        });

        if (existing) {
            return existing;
        }
        this.logger.log(`cache miss, calling Google for address=${addressNormalized}`);
        const geocode = await this.googleGeocodingService.geocode(addressText);

        if (!geocode.results?.length) {
            throw new UnprocessableEntityException('Address could not be geocoded');
        }

        const location = geocode.results[0].geometry.location;

        const address = await this.addressModel.create({
            address: addressText,
            addressNormalized,
            latitude: location.lat,
            longitude: location.lng,
            geocodeRaw: geocode,
            wildfireData: {
                count: 0,
                records: [],
                bbox: '',
                rangeDays: 7,
            },
        } as any);

        // validate creation
        if (!address || !address.id) {
            this.logger.error('Failed to create address', JSON.stringify(address));
            throw new InternalServerErrorException('Failed to create address');
        }
        
        this.logger.log(`calling FIRMS for lat=${address.latitude} lng=${address.longitude}`);
        const wildfire = await this.firmsService.fetchWildfires(
            address.latitude!,
            address.longitude!,
        );
        
        //update wildfire data
        address.wildfireData = wildfire as any;
        address.wildfireFetchedAt = new Date();
        await address.save();

        this.logger.log(`saved address id=${address.id}`);
        return address;
    }

    /**
     * List all addresses in the database.
     * @returns All addresses
     */
    async findAll() {
        const rows = await this.addressModel.findAll({
            attributes: ['id', 'address', 'latitude', 'longitude'],
            order: [['createdAt', 'DESC']],
        });

        return rows;
    }

    /**
     * Find an address by ID.
     * @param id - The address ID
     * @returns The address
     */
    async findById(id: string) {
        const row = await this.addressModel.findByPk(id);
        if (!row) throw new NotFoundException(`Address ${id} not found`);
        return row;
    }
}
