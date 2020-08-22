/* eslint-disable */
const fs = require("fs");
const path = require("path");

const env = {
  isProduction: false,
  version: "dist",

  secureServerHost: process.env.SECURE_SERVER_HOST,
  idServerURL: process.env.ID_SERVER_URL,
};

if (process.env.BUILD_ENV) {
  env.isProduction = (process.env.BUILD_ENV == "PRODUCTION");
}
if (env.isProduction) {
  env.version = fs.readFileSync(path.join(__dirname, "../.release-version")).trim();
}

const data = "export const env = " + JSON.stringify(env, null, "    ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "src/y_global/env.ts"), data);
