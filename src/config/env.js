const dotenv = require("dotenv");

dotenv.config();

const required = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
  return process.env[key];
};

const env = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  MONGO_URI: required("MONGO_URI"),
  MONGO_DB_NAME: required("MONGO_DB_NAME"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = { env };
