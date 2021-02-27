import "reflect-metadata";
import createConnection from "./database";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { AppError } from "./errors/AppError";

import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res
    .status(500)
    .json({ status: "Error", message: `Internal Server Error ${err.message}` });
});

export { app };
