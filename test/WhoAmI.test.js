const request = require('supertest');
const app = require('../app');
const { User } = require('../app/models');


describe('User', () => {
    const admin = {
        email: "nilamcahya@gmail.com",
        password: "nilam"
    };

    const customer = {
        email: "Fikri@binar.co.id",
        password: "123456"
    }
    it("user succes to access (user is customer) with response with 200 as status code", () => {
        return request(app)
            .post("/v1/auth/login")
            .set("Content-Type", "application/json")
            .send({ email: customer.email, password: customer.password })
            .then((res) => {
                request(app)
                    .get("/v1/auth/whoami")
                    .set("authorization", "Bearer " + res.body.accessToken)
                    .then((res) => {
                        expect(res.statusCode).toBe(200);
                    });
            });
    });
    it("user failed to access (user is admin) with response with 401 as status code", () => {
        return request(app)
            .post("/v1/auth/login")
            .set("Content-Type", "application/json")
            .send({ email: admin.email, password: admin.password })
            .then((res) => {
                request(app)
                    .get("/v1/auth/whoami")
                    .set("authorization", "Bearer " + res.body.accessToken)
                    .then((res) => {
                        expect(res.statusCode).toBe(401);
                        expect(res.body).toEqual({
                            error: {
                                name: 'Error',
                                message: 'Access forbidden!',
                                details: {
                                    role: 'ADMIN',
                                    reason: 'ADMIN is not allowed to perform this operation.',
                                },
                            },
                        });
                    });
            });
    });
});