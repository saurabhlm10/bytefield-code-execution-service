import cors from "cors";
import morgan from "morgan";
import express from "express";
import router from "./routes/index.route";
import { ENV } from "./constants";

const app = express();

app.use(
  cors({
    origin: ENV.clientUrl,
    credentials: true,
  })
);

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
