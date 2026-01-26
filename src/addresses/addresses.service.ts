import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';
import { normalizeAddress } from './address-normalize';
import { GoogleGeocodingService } from '../integrations/google/geocoding.service';
//Addresses Service
@Injectable()
export class AddressesService {
    private readonly logger = new Logger(AddressesService.name);

    constructor(
        @InjectModel(Address) private readonly addressModel: typeof Address,
        private readonly googleGeocodingService: GoogleGeocodingService
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
        // TEMP: placeholder until Google + FIRMS
        const addressNormalized = normalizeAddress(addressText);

        const existing = await this.addressModel.findOne({
            where: { addressNormalized },
        });

        if (existing) {
            return existing;
        }
        
        const geocode = await this.googleGeocodingService.geocode(addressText);

        const location = geocode.results[0].geometry.location;


        const created = await this.addressModel.create({
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

        this.logger.log(`Created address id=${created.id}`);
        return created;
    }

    async findAll() {
        const rows = await this.addressModel.findAll({
            attributes: ['id', 'address', 'latitude', 'longitude'],
            order: [['createdAt', 'DESC']],
        });

        return rows;
    }

    async findById(id: string) {
        const row = await this.addressModel.findByPk(id);
        if (!row) throw new NotFoundException(`Address ${id} not found`);
        return row;
    }
}
