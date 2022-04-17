const fs = require("fs");
const path = require("path");

const getENV = () => {
  return Object.entries(process.env).reduce((e, [key, value]) => {
    if (key.startsWith("ENV_")) {
      const k = key.split("ENV_")[1];
      return {
        ...e,
        [k]: value,
      };
    }
    return e;
  }, {});
};
const createAliasPrefixer = (prefix, separator = "-") => {
  const prependApplicationName = (value) => {
    return `${prefix}${separator}${value}`;
  };

  return (webpackAlias) => {
    const p = Object.entries(webpackAlias);

    return p.reduce((acc, [name, path]) => {
      return {
        ...acc,
        [prependApplicationName(name)]: path,
      };
    }, []);
  };
};

const getFolderNamesInPath = (p) => {
  return fs
    .readdirSync(path.resolve(p), { withFileTypes: true })
    .filter((dirEntry) => dirEntry.isDirectory())
    .map(({ name }) => name);
};

const getAliasInPath = (p) => {
  const dirs = getFolderNamesInPath(p);

  return dirs.reduce((acc, name) => {
    return {
      ...acc,
      [name]: path.resolve(`${p}/${name}`),
    };
  }, {});
};

const createAlias = ({ prefix, separator = "-", path }) => {
  const prefixAlias = createAliasPrefixer(prefix, separator);
  const folderPaths = getAliasInPath(path);
  return prefixAlias(folderPaths);
};

module.exports = { createAlias, getENV };
