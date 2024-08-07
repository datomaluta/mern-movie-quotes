import { UseFormRegister } from "react-hook-form";

const CustomSelect = ({
  register,
  placeholder,
  options,
  name,
  rules,
  errorText,
  disabled,
}: {
  register: UseFormRegister<any>;
  placeholder: string;
  options: { id: string; name: string }[] | undefined;
  name: string;
  rules?: { [key: string]: any };
  errorText: string | undefined;
  disabled: boolean;
}) => {
  return (
    <div>
      <select
        {...register(name, rules)}
        className="bg-transparent border border-project-gray rounded px-3 py-2 w-full disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <option className="text-project-dark-blue" value="">
          {placeholder}
        </option>
        {options?.map((option) => (
          <option
            className="text-project-dark-blue"
            key={option.id}
            value={option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
      <p className="text-sm text-project-danger h-4 mt-1">{errorText}</p>
    </div>
  );
};

export default CustomSelect;
