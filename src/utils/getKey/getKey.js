const buildKeyGetter = () => {
  let count = 0;
  const weakMap = new WeakMap();
  return (obj) => {
    if (weakMap.has(obj)) {
      return weakMap.get(obj);
    }
    ++count;
    weakMap.set(obj, count);
    return weakMap.get(obj);
  };
};

export default buildKeyGetter();
