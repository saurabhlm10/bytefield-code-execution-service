import { Request, Response } from "express";
import CustomError from "../utils/customError.util";
import { ExecuteCodeService } from "../services/execute-code.service";

const executeCodeService = new ExecuteCodeService();

export const executeCodeController = async (req: Request, res: Response) => {
  const { fileStructure } = req.body;

  if (!fileStructure) {
    throw new CustomError("File structure is required", 400);
  }
  const result = await executeCodeService.executeCode(fileStructure);

  return { result, status: 200 };
};

export const updateCodeController = async (req: Request, res: Response) => {
  const { fileStructure } = req.body;

  if (!fileStructure) {
    throw new CustomError("File structure is required", 400);
  }

  const result = await executeCodeService.updateCode(fileStructure);

  return { result, status: 200 };
};
