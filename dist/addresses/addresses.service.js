"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AddressesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const address_model_1 = require("./address.model");
const address_normalize_1 = require("./address-normalize");
const geocoding_service_1 = require("../integrations/google/geocoding.service");
const firms_service_1 = require("../integrations/firms/firms.service");
let AddressesService = AddressesService_1 = class AddressesService {
    addressModel;
    googleGeocodingService;
    firmsService;
    logger = new common_1.Logger(AddressesService_1.name);
    constructor(addressModel, googleGeocodingService, firmsService) {
        this.addressModel = addressModel;
        this.googleGeocodingService = googleGeocodingService;
        this.firmsService = firmsService;
    }
    async create(addressText) {
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
        });
        if (!address || !address.id) {
            this.logger.error('Failed to create address', JSON.stringify(address));
            throw new common_1.InternalServerErrorException('Failed to create address');
        }
        await this.fetchAndAttachWildfire(address);
        this.logger.log(`saved address id=${address.id}`);
        return address;
    }
    validateAndNormalize(addressText) {
        if (!addressText || !addressText.trim()) {
            this.logger.error(`Invalid address input: ${JSON.stringify(addressText)}`);
            throw new common_1.BadRequestException('Address is required');
        }
        const addressNormalized = (0, address_normalize_1.normalizeAddress)(addressText);
        if (!addressNormalized || !addressNormalized.trim()) {
            this.logger.error(`Address normalized to empty for input: ${addressText}`);
            throw new common_1.BadRequestException('Address could not be normalized');
        }
        return addressNormalized;
    }
    async fetchGeocode(addressText, addressNormalized) {
        try {
            return await this.googleGeocodingService.geocode(addressText);
        }
        catch (err) {
            this.logger.error(`Google geocoding failed for address=${addressNormalized}`, (err && err.stack) || (err && err.message) || String(err));
            throw new common_1.InternalServerErrorException('Failed to geocode address');
        }
    }
    parseGeocode(geocode, addressNormalized) {
        const lat = geocode?.lat ?? geocode?.results?.[0]?.geometry?.location?.lat;
        const lng = geocode?.lng ?? geocode?.results?.[0]?.geometry?.location?.lng;
        const raw = geocode?.raw ?? geocode;
        const hasResultsArray = Array.isArray(geocode?.results) && geocode.results.length > 0;
        const hasDirectCoords = lat !== undefined && lng !== undefined;
        if (!geocode || (!hasResultsArray && !hasDirectCoords)) {
            this.logger.warn(`Geocoding returned no usable results for address=${addressNormalized}`);
            throw new common_1.UnprocessableEntityException('Address could not be geocoded');
        }
        return { lat, lng, raw };
    }
    validateCoordinates(lat, lng, addressNormalized) {
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            this.logger.error(`Invalid coordinates from geocoding for address=${addressNormalized} lat=${lat} lng=${lng}`);
            throw new common_1.UnprocessableEntityException('Geocoding returned invalid coordinates');
        }
        if (lat === 0 && lng === 0) {
            this.logger.warn(`Geocoding returned 0,0 for address=${addressNormalized}`);
            throw new common_1.UnprocessableEntityException('Geocoding returned invalid coordinates');
        }
    }
    async fetchAndAttachWildfire(address) {
        this.logger.log(`calling FIRMS for lat=${address.latitude} lng=${address.longitude}`);
        const wildfire = await this.firmsService.fetchWildfires(address.latitude, address.longitude);
        address.wildfireData = wildfire;
        address.wildfireFetchedAt = new Date();
        this.logger.log(`final wildfireData.count=${address.wildfireData.count}`);
        await address.save();
    }
    async findAllPaginated({ limit, offset }) {
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
    async findById(id) {
        const address = await this.addressModel.findByPk(id);
        if (!address) {
            this.logger.log(`Address not found id=${id}`);
            throw new common_1.NotFoundException('Address not found');
        }
        return address;
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = AddressesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(address_model_1.Address)),
    __metadata("design:paramtypes", [Object, geocoding_service_1.GoogleGeocodingService,
        firms_service_1.FirmsService])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map