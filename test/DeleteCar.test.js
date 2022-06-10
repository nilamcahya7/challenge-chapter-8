const request = require("supertest");
const app = require("../app");
const { Car } = require('../app/models');


describe("DELETE /v1/cars/:id", () => {
    let car;
    beforeEach(async () => {
        car = await Car.create({
          name: 'Avanza',
          price: 500000,
          size: 'SMALL',
          image: "https://source.unsplash.com/505x505",
        });
    
        return car;
      });
    
      afterEach(() => car.destroy());

//Login using the registered admin account
const admin = {
    email: "nilamcahya@gmail.com",
    password: "nilam"
};

const customer = {
    email: "Fikri@binar.co.id",
    password: "123456"
}

it("user is admin and successfully create car with response 200 as status code", async () => {
    return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json")
        .send({ email: admin.email, password: admin.password })
        .then((res) => {
            request(app)
                .delete(`/v1/cars/${car.id}`)
                .set("authorization", "Bearer " + res.body.accessToken)
                .send(car)
                .then((res) => {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.message).toEqual(
                        "successfully deleted car id " + car.id
                      );
                });
        });
});

it("user failed to create car(Not Admin) with response 401 as status code", async () => {
    return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json")
        .send({ email: customer.email, password: customer.password })
        .then((res) => {
            request(app)
                .delete(`/v1/cars/${car.id}`)
                .set("authorization", "Bearer " + res.body.accessToken)
                .send(car)
                .then((resp) => {
                    expect(resp.statusCode).toBe(401);
                    expect(resp.body).toEqual({
                        error: {
                            name: "Error",
                            message: "Access forbidden!",
                            details: {
                                role: "CUSTOMER",
                                reason: "CUSTOMER is not allowed to perform this operation.",
                            },
                        },
                    });
                });
        });
});
});