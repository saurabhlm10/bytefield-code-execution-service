import CustomError from "../utils/customError.util";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import { io } from "../server";
import { assignPort } from "../utils/assignPort.util";
// import { ProjectRepository } from "../repositories/project.repository";
import AWS, { Lambda } from "aws-sdk";

const lambda = new Lambda({ region: "ap-south-1" });

async function invokeLambdaToUpdateEFS(name: string, fileStructure: any) {
  const params = {
    FunctionName: "bytefield-efs",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      projectName: name,
      fileStructure: fileStructure,
    }),
  };

  try {
    const lambdaResponse = await lambda.invoke(params).promise();
    console.log("Lambda response:", lambdaResponse);
    // Handle response
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    throw new Error("Failed to invoke Lambda function");
  }
}

export class ExecuteCodeService {
  //   private projectRepository = new ProjectRepository();
  async executeCode(fileStructure: any) {
    try {
      console.log("reached");
      console.log(fileStructure.name);
      //   await invokeLambdaToUpdateEFS("/", fileStructure);

      //   Create a temporary directory to store the project files
      const parentDir = path.join(__dirname, "..", "..", "..");

      // Check if the specific directory exists, create or reuse it accordingly.
      let tempDir = path.join(parentDir);

      if (!fs.existsSync(tempDir)) {
        // If the directory does not exist, create it.
        fs.mkdirSync(tempDir);
        console.log(`Created directory: ${tempDir}`);
      } else {
        console.log(`Directory already exists, reusing: ${tempDir}`);
      }
      // Store projectDir in DB
      // await this.projectRepository.updateProject({
      //   id: parseInt(fileStructure.id),
      //   projectData: { currentProjectDir: tempDir },
      // });

      console.log("tempDir", tempDir);

      console.log("Writing");
      //   Write the file/folder structure to the temporary directory
      writeFilesAndFolders(tempDir, fileStructure);

      console.log("Running Container");

      //   Build and run the Docker container
      const containerOutput: any = await runDockerContainer(
        tempDir,
        fileStructure.name
      );

      //   Clean up the temporary directory
      fs.rmSync(tempDir, { recursive: true, force: true });

      return containerOutput;
    } catch (error) {
      console.error("An error occurred:", error);
      throw new CustomError("Failed to execute code", 500);
    }
  }

  async updateCode(fileStructure: any) {
    const id = fileStructure.id;

    await invokeLambdaToUpdateEFS("/", fileStructure);

    // const project = await this.projectRepository.getProjectById({
    //   id: parseInt(id),
    // });

    // if (!project) throw new CustomError("No project Found with id " + id, 400);

    // writeFilesAndFolders(project.currentProjectDir as string, fileStructure);

    const successMessage = "Successfully updated code";

    io.emit("log", successMessage);
    return { result: successMessage };
  }
}

function writeFilesAndFolders(basePath: string, item: any) {
  const fullPath = path.join(basePath, item.name);

  if (item.isFolder) {
    const newCreated = fs.mkdirSync(fullPath, { recursive: true });
    item.children.forEach((child: any) =>
      writeFilesAndFolders(fullPath, child)
    );
  } else {
    const newCreated = fs.writeFileSync(fullPath, item.content);
  }
}

function runDockerContainer(projectDir: string, projectName: string) {
  console.log("Inside Docker");
  return new Promise(async (resolve, reject) => {
    console.log("projectDir", projectDir);

    const cwd = process.cwd();
    console.log("cwd", cwd);

    const port = await assignPort();

    const dockerCommand = `docker run --rm -p ${port}:4000 -v ${projectDir}:/app -w /app/${projectName} node:14 /bin/bash -c "npm install && npm start"`;

    const dockerProcess = spawn(dockerCommand, { shell: true });

    let containerStarted = false;

    dockerProcess.stdout.on("data", (data: any) => {
      if (!containerStarted) {
        containerStarted = true;
        io.emit("port", port);
      }

      console.log(`stdout: ${data}`);
      io.emit("log", data.toString());
      // You can process or log the output received from stdout here
    });

    dockerProcess.stderr.on("data", (data: any) => {
      console.error(`stderr: ${data}`);
      io.emit("log", data.toString());

      // You can process or log the output received from stderr here
    });

    dockerProcess.on("close", (code: any) => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        resolve("closed");
      } else {
        reject(`child process exited with code ${code}`);
      }
    });

    dockerProcess.on("error", (err: any) => {
      console.error("Failed to start subprocess.", err);
      reject(err);
    });
  });
}
