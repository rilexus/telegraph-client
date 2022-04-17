const decode = (encodedString) => {
  return JSON.parse(atob(encodedString));
};

export default decode;
