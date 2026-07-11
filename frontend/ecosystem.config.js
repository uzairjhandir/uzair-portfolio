module.exports = {
  apps: [
    {
      name: "portfolio-frontend",
      script: "npm",
      args: "start",
      cwd: "/home/uzair/frontend", // Ensure this matches absolute WHM user path
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
