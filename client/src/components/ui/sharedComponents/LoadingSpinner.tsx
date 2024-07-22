import { ImSpinner2 } from "react-icons/im";

const LoadingSpinner = ({ className }: { className?: string }) => {
  return <ImSpinner2 className={`animate-spin ${className}`} />;
};

export default LoadingSpinner;
