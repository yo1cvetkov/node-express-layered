import express from "express";
import cors from "cors";
import router from "@/router";
import morgan from "morgan";
import { db } from "./db";
import { errorHandler } from "./middlewares/errorHandler.middleware";

db.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.log("Error during Data Source init", err);
  });

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(errorHandler);

export default app;
