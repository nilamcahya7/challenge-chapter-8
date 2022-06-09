const request = require('supertest');
const app = require('../app');

describe('GET/v1/cars', () => {
  it('get all cars from request ', async () => {
    return await request(app)
      .get('/v1/cars')
      .set('Content-Type', 'application/json')
      .expect(200);
  });
});