const request = require("supertest");
const app = require("../app");

describe("GET/", () => {
    it("application is running successfully with response 200 as status code", async () => {
        return request(app)
            .get("/")
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual({
                    status: "OK",
                    message: "BCR API is up and running!",
                });
            });
    });
    it("should response with 404 as status code (Application Not found)", async () => {
        return request(app)
            .get("/not-found")
            .then((res) => {
                expect(res.statusCode).toBe(404);
                expect(res.body).toEqual({
                    error: {
                        name: "Error",
                        message: "Not found!",
                        details: { method: "GET", url: "/not-found" },
                    },
                });
            });
    });
});
