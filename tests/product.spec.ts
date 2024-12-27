import request from "supertest";
import app from "../app";

describe("Express App", () => {
  // Test the /health endpoint
  it("should return 200 and a healthy status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "healthy" });
  });

  // Test the /data endpoint
  it("should return 201 and a welcome message when name is provided", async () => {
    const response = await request(app).post("/data").send({ name: "John" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Hello, John!" });
  });

  it("should return 400 when name is missing", async () => {
    const response = await request(app).post("/data").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Name is required" });
  });
});
