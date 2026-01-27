import {
  Injectable,
  UnprocessableEntityException,
  BadGatewayException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { GeocodingResponse } from './geocoding.model';

@Injectable()
export class GoogleGeocodingService {
  private readonly logger = new Logger(GoogleGeocodingService.name);

  /**
   * Geocode an address using Google Maps API.
   * @param address
   * @returns Geocoded location (latitude, longitude), or throws an error
   */
  async geocode(address: string) {
    const key = process.env.GOOGLE_GEOCODING_API_KEY;
    if (!key) throw new Error('GOOGLE_GEOCODING_API_KEY missing');

    let data: GeocodingResponse;
    try {
      const res = await axios.get<GeocodingResponse>(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: { address, key },
          timeout: 8000,
        },
      );
      data = res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        'GoogleGeocodingService - Error geocoding address',
        msg,
      );
      throw new BadGatewayException('Geocoding provider unavailable');
    }

    const first = data.results?.[0];
    const loc = first?.geometry?.location;
    if (!loc || loc.lat === undefined || loc.lng === undefined) {
      this.logger.error(
        'GoogleGeocodingService - Address could not be geocoded',
      );
      throw new UnprocessableEntityException('Address could not be geocoded');
    }

    const lat = Number(loc.lat);
    const lng = Number(loc.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      this.logger.error(
        'GoogleGeocodingService - Geocoding returned invalid coordinates',
      );
      throw new UnprocessableEntityException('Address could not be geocoded');
    }

    return { lat, lng, raw: data };
  }
}
