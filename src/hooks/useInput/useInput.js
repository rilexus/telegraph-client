import { useCallback, useState } from "react";

const useInput = ({ name, initialValue, ...rest }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    const { value } = e.target;
    setValue(value);
  }, []);

  return {
    ...rest,
    value,
    name,
    onChange: handleChange,
  };
};

export default useInput;
