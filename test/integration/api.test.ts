// test/integration/api.test.ts

import supertest from 'supertest';
import app from '../../src/index'; // Adjust the import path based on your project structure

const request = supertest(app);

describe('GET /quotes/best-three', () => {
  it('responds with status 200 and an array of quotes', async () => {
    const response = await request.get('/quotes/best-three');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Add more integration tests for other endpoints...
});
