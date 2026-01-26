import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';

@Injectable()
export class AddressesService {
    private readonly logger = new Logger(AddressesService.name);

    constructor(@InjectModel(Address) private readonly addressModel: typeof Address) {}

    async create(addressText: string) {
        // TEMP: placeholder until Google + FIRMS
        const created = await this.addressModel.create({
            address: addressText,
            latitude: 0,
            longitude: 0,
            wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 }
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
