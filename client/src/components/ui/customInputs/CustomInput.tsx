import { UseFormRegister } from "react-hook-form";
import InputWrapper from "./InputWrapper";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

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
  passwordIsVisible = false,
  setPasswordIsVisible = () => {},
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
  passwordIsVisible?: boolean;
  setPasswordIsVisible?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <InputWrapper
      name={name}
      label={label}
      errorText={errorText}
      required={!!rule?.required}
      labelIsHidden={labelIsHidden}
    >
      <div className="relative">
        {name.includes("password") && (
          <button
          tabIndex={-1}
            onClick={() =>
              setPasswordIsVisible((currentState) => !currentState)
            }
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-project-gray"
          >
            {passwordIsVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        )}
        <input
          {...register(name, rule)}
          className={`w-full px-3 py-2 md:px-[10px] md:py-[6px] bg-project-light-sky-blue text-gray-900 rounded placeholder:text-sm placeholder:text-project-gray border-transparent border-2 block outline-none shadow-md
         focus:ring focus:ring-project-outline-blue transition-all md:text-sm ${
           errorText ? "!border-project-danger" : ""
         } ${className}`}
          type={type}
          disabled={readOnly}
          placeholder={placeholder ? placeholder : ""}
        />
      </div>
    </InputWrapper>
  );
};

export default CustomInput;
