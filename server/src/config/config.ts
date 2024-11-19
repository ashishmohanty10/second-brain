import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  env: process.env.NODE_DEVELOPMENT,
};

export const config = Object.freeze(_config);
