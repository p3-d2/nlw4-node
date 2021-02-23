import "reflect-metadata";
import "./database";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.post("/", (req, res) => {
  return res.json({ message: "Os dados foram salvos" });
});

app.listen(3333, () => {
  console.log("server is running");
});
