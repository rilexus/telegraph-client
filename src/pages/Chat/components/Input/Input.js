import React, { forwardRef } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  color: white;
  background: none;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid gray;
  outline: none;
  width: 100%;
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active,
  :-webkit-autofill:focus {
    background-color: transparent;
    -webkit-box-shadow: 0 0 0 50px black inset; /*your box-shadow*/
    -webkit-text-fill-color: white;
  }
`;

const Input = forwardRef(function Input(props, ref) {
  return <StyledInput type="text" {...props} ref={ref} />;
});

export default Input;
