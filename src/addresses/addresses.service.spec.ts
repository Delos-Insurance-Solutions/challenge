import { Test, TestingModule } from '@nestjs/testing';
import {InternalServerErrorException, UnprocessableEntityException} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

import { AddressesService } from './addresses.service';
import { Address } from './address.model'; 

import { GoogleGeocodingService } from '../integrations/google/geocoding.service'; 
import { FirmsService } from '../integrations/firms/firms.service'; 

describe('AddressesService', () => {
  let service: AddressesService;

  // Mocks
  const addressModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAndCountAll: jest.fn(),
  };

  const addressResponseMock = ({
    address: jest.fn(),
    latitude: jest.fn(),
    longitude: jest.fn(),
    geocodeRaw: jest.fn(),
    wildfireData: { count: 0, records: [], bbox: '', rangeDays: 7 },
  } as any);

  const googleMock = {
    geocode: jest.fn(),
  };

  const firmsMock = {
    fetchWildfires: jest.fn(), 
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AddressesService,
        { provide: getModelToken(Address), useValue: addressModelMock },
        { provide: GoogleGeocodingService, useValue: googleMock },
        { provide: FirmsService, useValue: firmsMock },
      ],
    }).compile();

    service = moduleRef.get(AddressesService);
  });

  it('returns cached address (cache hit) and does not call external services', async () => {
    // ARRANGE
    const cached = {
      id: 'uuid-1',
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
      addressNormalized: '1600 amphitheatre parkway mountain view ca',
      latitude: 37.422,
      longitude: -122.084,
    };
    const address = '1600 Amphitheatre Parkway, Mountain View, CA'
    addressModelMock.findOne.mockResolvedValue(cached);

    // ACT
    const result = await service.create(address); 


    // ASSERT
    expect(result.address).toBe(address);
    expect(addressModelMock.findOne).toHaveBeenCalledTimes(1);
    expect(googleMock.geocode).not.toHaveBeenCalled();
    expect(firmsMock.fetchWildfires).not.toHaveBeenCalled();
  });

  it('throws 422 when address is not geocodable', async () => {
    addressModelMock.findOne.mockResolvedValue(null);
    googleMock.geocode.mockResolvedValue({ results: [] });

    await expect(service.create('some weird address')).rejects.toBeInstanceOf(
        UnprocessableEntityException,
    );

    expect(googleMock.geocode).toHaveBeenCalledTimes(1);
    expect(firmsMock.fetchWildfires).not.toHaveBeenCalled();
  });


});