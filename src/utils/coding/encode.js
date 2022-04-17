const encode = (obj) => {
  return btoa(JSON.stringify(obj));
};

export default encode;
