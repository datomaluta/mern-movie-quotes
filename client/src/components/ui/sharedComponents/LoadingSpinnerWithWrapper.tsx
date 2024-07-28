import LoadingSpinner from "./LoadingSpinner";

const LoadingSpinnerWithWrapper = () => {
  return (
    <div className="w-full mt-20 flex justify-center">
      <LoadingSpinner className="h-6 w-6" />
    </div>
  );
};

export default LoadingSpinnerWithWrapper;
