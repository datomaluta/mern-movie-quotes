import LoadingSpinner from "./LoadingSpinner";

const LoadingSpinnerWithWrapper = ({ blur = false }: { blur?: boolean }) => {
  return (
    <div
      className={`w-full flex justify-center ${
        blur
          ? "absolute top-0 left-0 right-0 bottom-0 bg-zinc-700 bg-opacity-60 transition-all rounded-lg animate-pulse"
          : ""
      }`}
    >
      {!blur && <LoadingSpinner className="h-6 w-6 mt-20" />}
    </div>
  );
};

export default LoadingSpinnerWithWrapper;
