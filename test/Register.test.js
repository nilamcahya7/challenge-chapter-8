const request = require("supertest");
const app = require("../app");
const { User } = require("../app/models");

describe("POST/v1/auth/register", () => {
  const user201 = {
    name: "nilamc",
    email: "nilamc@gmail.com",
    password: "nilamc",
  };
  const user422 = {
    name: "nilamcc",
    email: "nilamcc@gmail.com",
    password: "nilamcc",
    role: 2,
  };
  beforeEach(async () => {
    await User.create(user422);
  });
  afterEach(async () => {
    await User.destroy({
      where: {
        email: user201.email,
      },
    });
    await User.destroy({
      where: {
        email: user422.email,
      },
    });
  });

  it("user success register with response 201 as status code", async () => {
    return await request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send(user201)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.accesToken).toEqual(res.body.accesToken);
      });
  });
  it("user failed to register(Email Already Taken) with response 422 as status code", async () => {
    return await request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send(user422)
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.error.details.email.toLowerCase()).toEqual(
          user422.email.toLowerCase()
        );
      });
  });
});