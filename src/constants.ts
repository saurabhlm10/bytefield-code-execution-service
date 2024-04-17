import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const clientUrl = process.env.CLIENT_URL;

export const ENV = {
  port,
  clientUrl,
};
