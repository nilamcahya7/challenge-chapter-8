const request = require("supertest");
const app = require("../app");

describe("GET/v1/cars/:id", () => {
  it("success get car data by id with response 200 as status code", () => {
    return request(app)
      .get("/v1/cars/2")
      .set("Content-Type", "application/json")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});