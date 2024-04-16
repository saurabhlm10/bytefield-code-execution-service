import dotenv from "dotenv";

dotenv.config();

import express from "express";
import router from "./routes/index.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
