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
    // it('Define who logged in (CUSTOMER)', () => {
    //     return request(app)
    //         .post("/v1/auth/login")
    //         .set("Content-Type", "application/json")
    //         .send({ email: customer.email, password: customer.password })
    //         .then((res) => {
    //             request(app)
    //                 .get("/v1/auth/whoami") // request api whoami
    //                 .set("authorization", "Bearer " + res.body.accessToken) // set authorization jwt
    //                 .then((res) => {
    //                     expect(res.statusCode).toBe(200); // check status respond
    //                 });
    //         });
    // });
    it('Define who logged in (ADMIN)', () => {
        return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json")
        .send({ email: admin.email, password: admin.password })
        .then((res) => {
            request(app)
            .get("/v1/auth/whoami") // request api whoami
            .set("authorization", "Bearer " + res.body.accessToken)
                .then((res) => {
                    expect(res.statusCode).toBe(401);
                });
        });
    });
});