/** PM2 config — run from app root: pm2 start deploy/ecosystem.config.cjs */
const path = require("node:path");

module.exports = {
  apps: [
    {
      name: "gvpv-warehouse-v2",
      cwd: path.join(__dirname, ".."),
      script: "npm",
      args: "start",
      env_file: ".env",
    },
  ],
};