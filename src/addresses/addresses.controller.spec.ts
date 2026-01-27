import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import AddressesService from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Address } from './address.model'; // add this near the top

describe('AddressesController', () => {
  let controller: AddressesController;
  let service: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: {
            create: jest.fn(),
            findAllPaginated: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
    service = module.get<AddressesService>(AddressesService);
  });

  it('creates a new address successfully', async () => {
    const dto: CreateAddressDto = { address: '1600 Amphitheatre Parkway' };
    const createdAddress = {
      id: '1',
      address: '1600 Amphitheatre Parkway',
      addressNormalized: '1600 Amphitheatre Parkway',
      latitude: 37.422,
      longitude: -122.084,
      wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, 'create').mockResolvedValue(createdAddress as unknown as Address);
    const result = await controller.create(dto);

    expect(result).toEqual(createdAddress);
    expect(service.create).toHaveBeenCalledWith(dto.address);
  });

  it('throws BadRequestException when creating an address with empty input', async () => {
    const dto: CreateAddressDto = { address: '' };

    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('lists addresses with valid pagination parameters', async () => {
    //ARRANGE
    const paginatedResult = {
      total: 1,
      limit: 20,
      offset: 0,
      items: [
        {
          id: '1',
          address: '1600 Amphitheatre Parkway',
          addressNormalized: '1600 Amphitheatre Parkway',
          latitude: 37.422,
          longitude: -122.084,
          wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    jest.spyOn(service, 'findAllPaginated').mockResolvedValue(
        {
          ...paginatedResult,
          items: paginatedResult.items as unknown as Address[],
        } as unknown as { total: number; limit: number; offset: number; items: Address[] },
    );
    
    const result = await controller.list('20', '0');

    //ASSERT
    expect(result).toEqual(paginatedResult);
    expect(service.findAllPaginated).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
    });
  });

  it('returns a single address by id', async () => {
    //ARRANGE
    const address = {
      id: '1',
      address: '1600 Amphitheatre Parkway',
      addressNormalized: '1600 Amphitheatre Parkway',
      latitude: 37.422,
      longitude: -122.084,
      wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, 'findById').mockResolvedValue(address as unknown as Address);
    const result = await controller.findOne('1');
  
    //ASSERT
    expect(result).toEqual(address);
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('throws BadRequestException when id is empty in findOne', async () => {
    await expect(controller.findOne('')).rejects.toThrow(BadRequestException);
    expect(service.findById).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when address is not found', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null as unknown as Address);

    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    expect(service.findById).toHaveBeenCalledWith('1');
  });
});