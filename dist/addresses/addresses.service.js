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
let AddressesService = AddressesService_1 = class AddressesService {
    addressModel;
    logger = new common_1.Logger(AddressesService_1.name);
    constructor(addressModel) {
        this.addressModel = addressModel;
    }
    async create(addressText) {
        const addressNormalized = (0, address_normalize_1.normalizeAddress)(addressText);
        const existing = await this.addressModel.findOne({
            where: { addressNormalized },
        });
        if (existing) {
            return existing;
        }
        const created = await this.addressModel.create({
            address: addressText,
            addressNormalized,
            latitude: 0,
            longitude: 0,
            wildfireData: {
                count: 0,
                records: [],
                bbox: '',
                rangeDays: 7,
            },
        });
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
    async findById(id) {
        const row = await this.addressModel.findByPk(id);
        if (!row)
            throw new common_1.NotFoundException(`Address ${id} not found`);
        return row;
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = AddressesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(address_model_1.Address)),
    __metadata("design:paramtypes", [Object])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map