import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import {
  executeCodeController,
  updateCodeController,
} from "../controllers/execute-code.controller";

const executeCodeRouter = Router();

executeCodeRouter.post("/", asyncHandler(executeCodeController));
executeCodeRouter.put("/", asyncHandler(updateCodeController));

export default executeCodeRouter;
