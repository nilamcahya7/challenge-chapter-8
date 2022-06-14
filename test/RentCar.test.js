const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app"); 
const { User, Car } = require("../app/models"); 

describe("POST /v1/cars/:id/rent", () => {
  const car = {
    name: "Lamborghini",
    price: 700000,
    size: "LARGE",
    image: "https://source.unsplash.com/509x509",
    isCurrentlyRented: false,
  };

  const rentData = {
    rentStartedAt: "2022-06-09T15:44:03.156Z",
    rentEndedAt: "2022-06-09T15:44:03.156Z",
  };

  let idCar = 0;

  const idCarNotFound = 99093;

  const admin = {
    name: "nilamcahya",
    email: "nilam@gmail.com",
    encryptedPassword: bcrypt.hashSync("nilam", 10),
    roleId: 2,
  };
 
  const customer = {
    name: "nilam",
    email: "nilamdesu@gmail.com",
    encryptedPassword: bcrypt.hashSync("nilam", 10),
    roleId: 1,
  };
  beforeEach(async () => {
    await User.create(admin);
    await User.create(customer);
    const addCar = await Car.create(car);
    idCar = addCar.id;
    const findNotFoundCars = await Car.findByPk(idCarNotFound);
    if (findNotFoundCars) {
      await Car.destroy({
        where: {
          id: idCarNotFound,
        },
      });
    }
  });

  afterEach(async () => {
    await User.destroy({
      where: {
        email: admin.email.toLowerCase(),
      },
    });
  });

  it("user failed to rent car(user is admin) with response 401 as status code", async () => {
    return await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: admin.email, password: "nilam" })
      .then(async (res) => {
        await request(app)
          .post("/v1/cars/" + idCar + "/rent")
          .set("authorization", "Bearer " + res.body.accessToken)
          .send(rentData)
          .then(async (resp) => {
            await expect(resp.statusCode).toBe(401);
          });
      });
  });

  it("user success rent car with response 201 as status code", async () => {
    return await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: customer.email, password: "nilam" })
      .then(async (res) => {
        await request(app)
          .post("/v1/cars/" + idCar + "/rent") 
          .set("authorization", "Bearer " + res.body.accessToken) 
          .send(rentData)
          .then(async (response) => {
            await expect(response.statusCode).toBe(201);
            await expect(response.body.carId).toBe(idCar);
          });
      });
  });
  it("car is already rented with response 422 as status code", async () => {
    return await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: customer.email, password: "nilam" })
      .then(async (res) => {
        await request(app)
          .post("/v1/cars/" + idCar + "/rent") 
          .set("authorization", "Bearer " + res.body.accessToken)
          .send(rentData)
          .then(async () => {
            await request(app)
              .post("/v1/cars/" + idCar + "/rent") 
              .set("authorization", "Bearer " + res.body.accessToken) 
              .send(rentData)
              .then(async (res) => {
                await expect(res.statusCode).toBe(422); 
                await expect(res.body.error.message).toEqual(
                  "Car is already rented!!"
                );
              });
          });
      });
  });
});