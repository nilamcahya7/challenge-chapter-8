const request = require('supertest');
const app = require('../app');

describe('GET/v1/auth/login', () => {
  it('user success login with response 201 as status code"', async () => {
    const email = "Fikri@binar.co.id";
    const password = "123456";

    return await request(app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.accessToken).toEqual(res.body.accessToken);
      });
  });
  it('user failed to login(Email Is Not Registered) with response 404 as status code', async () => {
    const email = "Fikri2@binar.co.id";
    const password = "123456";

    return await request(app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body.email).toEqual(res.body.email);
      });
  });
  it('user failed to login(Password Entered is Wrong) with response 401 as status code', async () => {
    const email = "Fikri@binar.co.id";
    const password = "1234567";

    return await request(app)
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body.error.details.password).toEqual(
          "Please input correct password");
      });
  });
});