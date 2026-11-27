/** PM2 config — copy to server app root; load secrets from .env via deploy script. */
module.exports = {
  apps: [
    {
      name: "gvpv-warehouse-v2",
      cwd: __dirname + "/..",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
      },
    },
  ],
};