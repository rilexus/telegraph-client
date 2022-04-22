import { useCallback, useRef, useState } from "react";

const useInput = ({ name, initialValue, ...rest }) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    const { value } = e.target;
    setValue(value);
  }, []);

  return {
    ...rest,
    ref: inputRef,
    value,
    name,
    onChange: handleChange,
  };
};

export default useInput;
