import request from "supertest";
import createConnection from "../database";
import { app } from "../app";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  }, 90000);

  it("Should be able to create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "User example", email: "user@example.com" });

    expect(response.status).toBe(201);
  }, 90000);
});
