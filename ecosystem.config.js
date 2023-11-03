module.exports = {
  apps: [
    {
      name: "Blog_Application",
      script: "app.js",
      env: {
        NODE_ENV: "production",
      },
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
