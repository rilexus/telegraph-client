const path = require("path");

const devServer = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-Requested-With, content-type, Authorization",
  },
  static: {
    directory: path.join(__dirname, "public"),
  },
  open: true,
  compress: true,
  hot: true,
  port: 3000,
  historyApiFallback: true,
};

module.exports = devServer;
