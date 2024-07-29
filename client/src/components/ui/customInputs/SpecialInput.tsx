import { UseFormRegister } from "react-hook-form";

const SpecialInput = ({
  register,
  name,
  type,
  placeholder,
  span,
  error,
  rules,
}: {
  register: UseFormRegister<any>;
  name: string;
  type: string;
  placeholder: string;
  span?: string;
  error: string;
  rules?: { [key: string]: any };
}) => {
  return (
    <div className="">
      <div className="relative">
        <input
          {...register(name, rules)}
          type={type}
          className="w-full bg-transparent border-project-gray border rounded px-4 pr-12 py-2 outline-none focus:border-white transition-all placeholder:text-project-gray "
          placeholder={placeholder}
        />
        {span && (
          <span className="text-project-gray absolute right-4 top-1/2 -translate-y-1/2">
            {span}
          </span>
        )}
      </div>
      <p className="text-project-danger mt-1 text-sm h-5">{error}</p>
    </div>
  );
};

export default SpecialInput;
