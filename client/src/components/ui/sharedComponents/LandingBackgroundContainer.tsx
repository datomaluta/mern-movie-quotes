const LandingBackgroundContainer = ({
  className,
  quote,
  movie,
  year,
}: {
  className: string;
  quote: string;
  movie: string;
  year: string;
}) => {
  return (
    <div
      className={`h-[100vh] bg-fixed bg-no-repeat bg-cover bg-center transition-all relative ${className}`}
    >
      <div className="absolute top-[30%] left-[10%] max-w-[47rem] px-4">
        <div className="flex items-start gap-4">
          <span className="h-[0.125rem] w-12 md:w-4 bg-white block mt-10 md:mt-4 shrink-0"></span>
          <h1 className="text-5xl md:text-xl font-helvetica-bold leading-[4rem]">
            {`“${quote}”`}
          </h1>
        </div>
        <div className="flex items-start gap-4">
          <span className="h-[0.125rem] w-12 md:w-4 block mt-10 md:mt-4 shrink-0 bg-transparent"></span>
          <p className="text-3xl md:text-base font-helvetica-bold mt-4 ">
            {movie}, {year}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingBackgroundContainer;
