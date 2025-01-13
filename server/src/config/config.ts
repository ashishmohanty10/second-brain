import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET_KEY,
};

export const config = Object.freeze(_config);
