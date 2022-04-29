import { useCallback, useEffect, useRef, useState } from "react";

const getFormData = (e) => {
  const { target } = e;
  const formData = new FormData(target);
  return Object.fromEntries(formData);
};

const useForm = () => {
  const formRef = useRef(null);
  const [values, setValues] = useState({});

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const formValues = getFormData(e);
    setValues(formValues);
  }, []);

  const handleSubmit = useCallback(
    (callback) => {
      return (e) => {
        const formValues = getFormData(e);
        onSubmit(e);
        callback(e, formValues);
      };
    },
    [onSubmit]
  );

  useEffect(() => {
    const form = formRef.current;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    setValues(data);

    const handleInput = () => {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      setValues(data);
    };

    form.addEventListener("input", handleInput);
    return () => {
      form.removeEventListener("input", handleInput);
    };
  }, [formRef]);

  return {
    ref: formRef,
    values,
    handleSubmit,
    onSubmit,
  };
};
export default useForm;
