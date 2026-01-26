import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'csv-parse/sync';

export type FirmsRecordJson = Record<string, string>; // guardamos plano (strings) para JSONB

@Injectable()
export class FirmsService {
    private readonly logger = new Logger(FirmsService.name);

    constructor(private readonly http: HttpService) {}

    private bboxFromLatLng(lat: number, lng: number, delta: number) {
        const west = lng - delta;
        const south = lat - delta;
        const east = lng + delta;
        const north = lat + delta;
        // FIRMS espera west,south,east,north :contentReference[oaicite:4]{index=4}
        return `${west},${south},${east},${north}`;
    }

    /**
     * FetchCsv from FIRMS API.
     *
     * @param mapKey - The FIRMS map key
     * @param source - The FIRMS data source
     * @param bbox - The bounding box (west,south,east,north)
     * @param dayRange - The range of days to fetch
     * @returns CSV text
     * @example Saves it as a string to not add weird Date/Map objects to JSONB./
     * const address = await controller.create({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });
     */
    private async fetchCsv(mapKey: string, source: string, bbox: string, dayRange: number) {
        const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${bbox}/${dayRange}`;
        const res = await firstValueFrom(this.http.get(url, { responseType: 'text' }));
        return String(res.data ?? '');
    }

    /**
     * Parse CSV text into an array of objects.
     *
     * @param csvText - The CSV text to parse
     * @returns return CSV with headers (acq_date, acq_time, latitude, longitude, confidence, etc.)
     * @example Saves it as a string to not add weird Date/Map objects to JSONB./
     * const address = await controller.create({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });
     */
    private parseCsv(csvText: string): FirmsRecordJson[] {
        if (!csvText.trim()) return [];
        const records = parse(csvText, { columns: true, skip_empty_lines: true });
        return records as FirmsRecordJson[];
    }

    /**
     * Fetch wildfire data from FIRMS API.
     * @param lat - Latitude
     * @param lng - Longitude
     * @returns Wildfire data
     * @example Saves it as a string to not add weird Date/Map objects to JSONB./
     * const address = await controller.create({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });
     */
    async fetchWildfires(lat: number, lng: number) {
        const mapKey = process.env.FIRMS_MAP_KEY;
        if (!mapKey) throw new Error('FIRMS_MAP_KEY missing');

        const source = process.env.FIRMS_SOURCE || 'VIIRS_SNPP_NRT';
        const delta = Number(process.env.FIRMS_BBOX_DELTA || 0.1);

        const bbox = this.bboxFromLatLng(lat, lng, delta);
        const rangeDays = 7;

        try {
            const csv5 = await this.fetchCsv(mapKey, source, bbox, 5);
            const csv2 = await this.fetchCsv(mapKey, source, bbox, 2);

            const records = [...this.parseCsv(csv5), ...this.parseCsv(csv2)];

            this.logger.log(`FIRMS source=${source} bbox=${bbox} records=${records.length}`);

            return {
                count: records.length,
                records,
                bbox,
                rangeDays,
                source,
            };
        } catch (e: any) {
            this.logger.error(`FIRMS failed bbox=${bbox}`, e?.stack || e?.message || String(e));
            throw new BadGatewayException('Failed to fetch wildfire data from FIRMS');
        }
    }
}
