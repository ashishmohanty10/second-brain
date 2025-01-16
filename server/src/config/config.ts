import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET_KEY,
  node_env: process.env.NODE_ENV,
  frontend_url: process.env.FRONTEND_URL,
};

export const config = Object.freeze(_config);
