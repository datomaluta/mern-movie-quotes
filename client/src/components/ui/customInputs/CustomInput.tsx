import { UseFormRegister } from "react-hook-form";
import InputWrapper from "./InputWrapper";

const CustomInput = ({
  name,
  register,
  rule,
  errorText,
  type,
  //   backErrors,
  label,
  className,
  readOnly = false,
  labelIsHidden = false,
  placeholder,
}: {
  name: string;
  register: UseFormRegister<any>;
  rule?: { [key: string]: any };
  errorText: string | undefined;
  type: string;
  backErrors?: any;
  label?: string;
  className?: string;
  readOnly?: boolean;
  labelIsHidden?: boolean;
  placeholder?: string;
}) => {
  console.log(errorText);
  return (
    <InputWrapper
      name={name}
      label={label}
      errorText={errorText}
      required={!!rule?.required}
      labelIsHidden={labelIsHidden}
    >
      <input
        {...register(name, rule)}
        className={`w-full px-3 py-2 bg-project-light-sky-blue text-project-gray rounded placeholder:text-project-gray border-transparent border-2 block outline-none shadow-md focus:ring focus:ring-project-outline-blue transition-all ${
          errorText ? "!border-project-danger" : ""
        } ${className}`}
        type={type}
        disabled={readOnly}
        placeholder={placeholder ? placeholder : ""}
      />
    </InputWrapper>
  );
};

export default CustomInput;
