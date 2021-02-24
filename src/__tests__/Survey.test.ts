import request from "supertest";
import createConnection from "../database";
import { app } from "../app";

describe("Surveys", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  }, 90000);

  it("Should be able to create a new survey", async () => {
    const response = await request(app)
      .post("/surveys")
      .send({ title: "Title Example", description: "Description Example" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  }, 90000);

  it("should be able to get all surveys", async () => {
    await request(app)
      .post("/surveys")
      .send({ title: "Title Example2", description: "Description2" });

    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(2);
  }, 90000);
});
