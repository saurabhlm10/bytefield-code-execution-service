import { Router } from "express";
import executeCodeRouter from "./execute-code.route";

const v1Router = Router();

v1Router.use("/execute", executeCodeRouter);

export default v1Router;
