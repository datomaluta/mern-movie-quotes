import { UseFormRegister } from "react-hook-form";

const SpecialTextarea = ({
  register,
  name,
  placeholder,
  span,
  error,
  rules,
}: {
  register: UseFormRegister<any>;
  name: string;
  placeholder: string;
  span?: string;
  error: string;
  rules?: { [key: string]: any };
}) => {
  return (
    <div>
      <div className="relative">
        <textarea
          {...register(name, rules)}
          className="w-full bg-transparent border-project-gray border rounded px-4 pr-12 py-2 outline-none focus:border-white transition-all placeholder:text-project-gray"
          placeholder={placeholder}
        ></textarea>
        {span && (
          <span className="text-project-gray absolute right-4 top-[10%] ">
            {span}
          </span>
        )}
      </div>
      <p className="text-project-danger  text-sm h-5">{error}</p>
    </div>
  );
};

export default SpecialTextarea;
