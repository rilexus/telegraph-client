//eslint-disable-next-line
const path = require("path");
const fs = require("fs");
//eslint-disable-next-line
const HtmlWebpackPlugin = require("html-webpack-plugin");
//eslint-disable-next-line
const { EnvironmentPlugin, ProvidePlugin } = require("webpack");
//eslint-disable-next-line
require("dotenv").config({ path: ".env" });

const devServer = require("./webpack.dev-server");

const BUILD_FOLDER = "build";
const { getENV, createAlias } = require("./utils");

const getRootFolderPath = () => {
  return path.resolve(process.env.PWD);
};

const getPackageJson = (path) => {
  return JSON.parse(fs.readFileSync(`${path}/package.json`, "utf8"));
};

const getAlias = () => {
  const rootFolderPath = getRootFolderPath();
  const { name: applicationName } = getPackageJson(rootFolderPath);

  return createAlias({
    prefix: applicationName,
    path: `${rootFolderPath}/src`,
  });
};

module.exports = ({ development, production }) => {
  const mode = development ? "development" : "production";
  const rootPath = getRootFolderPath();

  const env = getENV();
  console.log("ENV");
  console.log("========");
  console.log(env);
  console.log("MODE:");
  console.log("========");
  console.log(mode);

  const alias = getAlias();


  console.log('Packages in the "src" folder can be accessed with: ');
  Object.keys(alias).forEach((name) => {
    console.log(`import {x, y, z} from "${name}"`);
  });

  return {
    entry: ["@babel/polyfill", "./src/index.js"],
    mode,
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
      ],
    },
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        os: require.resolve("os-browserify/browser"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert/"),
      },
      alias: alias,
      extensions: [".js"],
    },
    output: {
      path: path.resolve(rootPath, BUILD_FOLDER),
      filename: "bundle.js",
    },
    devServer: devServer,

    plugins: [
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new ProvidePlugin({
        process: "process/browser",
      }),
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new EnvironmentPlugin(env),
    ],
  };
};
