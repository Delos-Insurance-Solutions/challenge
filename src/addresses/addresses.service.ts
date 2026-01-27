// typescript
import {
    Injectable,
    NotFoundException,
    Logger, BadRequestException, InternalServerErrorException, UnprocessableEntityException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';
import { normalizeAddress } from './address-normalize';
import { GoogleGeocodingService } from '../integrations/google/geocoding.service';
import {FirmsService} from "../integrations/firms/firms.service";

@Injectable()
export class AddressesService {
    private readonly logger = new Logger(AddressesService.name);

    constructor(
        @InjectModel(Address) private readonly addressModel: typeof Address,
        private readonly googleGeocodingService: GoogleGeocodingService,
        private readonly firmsService: FirmsService,
    ) {}

    async create(addressText: string) {
        const addressNormalized = this.validateAndNormalize(addressText);

        const existing = await this.addressModel.findOne({ where: { addressNormalized } });
        if (existing) {
            this.logger.log(`cache hit for address=${addressNormalized} id=${existing.id}`);
            return existing;
        }

        this.logger.log(`cache miss, calling Google for address=${addressNormalized}`);

        const geocode = await this.fetchGeocode(addressText, addressNormalized);
        const { lat, lng, raw } = this.parseGeocode(geocode, addressNormalized);
        this.validateCoordinates(lat, lng, addressNormalized);

        const address = await this.addressModel.create({
            address: addressText,
            addressNormalized,
            latitude: lat,
            longitude: lng,
            geocodeRaw: raw,
            wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 },
        } as any);

        if (!address || !address.id) {
            this.logger.error('Failed to create address', JSON.stringify(address));
            throw new InternalServerErrorException('Failed to create address');
        }

        await this.fetchAndAttachWildfire(address);

        this.logger.log(`saved address id=${address.id}`);
        return address;
    }

    private validateAndNormalize(addressText: string): string {
        if (!addressText || !addressText.trim()) {
            this.logger.error(`Invalid address input: ${JSON.stringify(addressText)}`);
            throw new BadRequestException('Address is required');
        }

        const addressNormalized = normalizeAddress(addressText);
        if (!addressNormalized || !addressNormalized.trim()) {
            this.logger.error(`Address normalized to empty for input: ${addressText}`);
            throw new BadRequestException('Address could not be normalized');
        }

        return addressNormalized;
    }

    private async fetchGeocode(addressText: string, addressNormalized: string): Promise<any> {
        try {
            return await this.googleGeocodingService.geocode(addressText);
        } catch (err: unknown) {
            this.logger.error(
                `Google geocoding failed for address=${addressNormalized}`,
                (err && (err as any).stack) || (err && (err as any).message) || String(err),
            );
            throw new InternalServerErrorException('Failed to geocode address');
        }
    }

    private parseGeocode(geocode: any, addressNormalized: string): { lat: number; lng: number; raw: any } {
        const lat = geocode?.lat ?? geocode?.results?.[0]?.geometry?.location?.lat;
        const lng = geocode?.lng ?? geocode?.results?.[0]?.geometry?.location?.lng;
        const raw = geocode?.raw ?? geocode;

        const hasResultsArray = Array.isArray(geocode?.results) && geocode.results.length > 0;
        const hasDirectCoords = lat !== undefined && lng !== undefined;

        if (!geocode || (!hasResultsArray && !hasDirectCoords)) {
            this.logger.warn(`Geocoding returned no usable results for address=${addressNormalized}`);
            throw new UnprocessableEntityException('Address could not be geocoded');
        }

        return { lat, lng, raw };
    }

    private validateCoordinates(lat: number, lng: number, addressNormalized: string): void {
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            this.logger.error(`Invalid coordinates from geocoding for address=${addressNormalized} lat=${lat} lng=${lng}`);
            throw new UnprocessableEntityException('Geocoding returned invalid coordinates');
        }

        if (lat === 0 && lng === 0) {
            this.logger.warn(`Geocoding returned 0,0 for address=${addressNormalized}`);
            throw new UnprocessableEntityException('Geocoding returned invalid coordinates');
        }
    }

    private async fetchAndAttachWildfire(address: Address): Promise<void> {
        this.logger.log(`calling FIRMS for lat=${address.latitude} lng=${address.longitude}`);
        const wildfire = await this.firmsService.fetchWildfires(address.latitude!, address.longitude!);

        address.wildfireData = wildfire as any;
        address.wildfireFetchedAt = new Date();
        this.logger.log(`final wildfireData.count=${address.wildfireData.count}`);

        await address.save();
    }

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

    async findById(id: string) {
        const address = await this.addressModel.findByPk(id);
        if (!address) {
            this.logger.log(`Address not found id=${id}`);
            throw new NotFoundException('Address not found');
        }
        return address;
    }
}