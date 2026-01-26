import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleGeocodingService {
    async geocode(address: string) {
        const res = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
                params: {
                    address,
                    key: process.env.GOOGLE_GEOCODING_API_KEY,
                },
            },
        );

        if (res.data.status !== 'OK') {
            throw new Error(`Google Geocoding failed: ${res.data.status}`);
        }

        return res.data;
    }
}
