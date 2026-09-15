import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /api/v1/health', () => {
  it('responde 200 con status UP', async () => {
    const app = createApp();

    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'UP' });
  });
});

describe('Rutas no existentes', () => {
  it('responde 404 con el formato de ErrorResponse', async () => {
    const app = createApp();

    const res = await request(app).get('/api/v1/no-existe');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      status: 404,
      error: 'ROUTE_NOT_FOUND',
    });
  });
});
