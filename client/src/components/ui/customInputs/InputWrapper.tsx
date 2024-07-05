import { ReactNode } from "react";
import { useTranslate } from "../../../hooks/useTranslate";
import { translations } from "../../../lang/common";

const InputWrapper = ({
  name,
  children,
  errorText,
  //   backErrors,
  label,
  className,
  required,
  labelIsHidden,
}: {
  name: string;
  errorText: string | undefined;
  //   backErrors?: any;
  children?: ReactNode;
  label?: string;
  className?: string;
  required?: boolean;
  labelIsHidden?: boolean;
}) => {
  const { t } = useTranslate(translations);

  return (
    <div className={`w-full mb-1 ${className}`}>
      {!labelIsHidden && (
        <div className="flex gap-1">
          <label className="mb-2 block text-label-gray">
            {t(label || "") || t(name)}
          </label>
          {required && <span className="text-project-danger">*</span>}
        </div>
      )}
      {children}
      <p className="text-sm text-project-danger h-5 mt-1">
        {errorText ? errorText?.toString() : ""}
      </p>
    </div>
  );
};

export default InputWrapper;
