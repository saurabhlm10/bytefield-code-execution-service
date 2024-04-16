import dotenv from "dotenv";
import app from "./app";
import { ENV } from "./constants";

dotenv.config();

const port = ENV.port;

app.listen(port, () => console.log("Server listening on " + port));
