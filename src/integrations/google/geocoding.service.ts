import { Injectable, UnprocessableEntityException, BadGatewayException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleGeocodingService {

    /**
     * Geocode an address using Google Maps API.
     * @param address
     * @returns Geocoded location (latitude, longitude), or throws an error
     */
    async geocode(address: string) {
        const key = process.env.GOOGLE_GEOCODING_API_KEY;
        if (!key) throw new Error('GOOGLE_GEOCODING_API_KEY missing');

        let data: any;
        try {
            const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: { address, key },
                timeout: 8000,
            });
            data = res.data;
        } catch (e) {
            throw new BadGatewayException('Geocoding provider unavailable');
        }

        // Ok status but ok without them → input non geocodable
        const first = data?.results?.[0];
        const loc = first?.geometry?.location;
        if (!loc) {
            throw new UnprocessableEntityException('Address could not be geocoded');
        }

        return { lat: Number(loc.lat), lng: Number(loc.lng), raw: data };
    }
}
