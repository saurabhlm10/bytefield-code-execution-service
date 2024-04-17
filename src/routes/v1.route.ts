import { Router } from "express";
import executeCodeRouter from "./execute-code.route";

const v1Router = Router();

v1Router.get("/health", (req, res) =>
  res.send("Hello From Bytefield Code Execution Service")
);
v1Router.use("/execute", executeCodeRouter);

export default v1Router;
