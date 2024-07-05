import { Dispatch, ReactNode, SetStateAction } from "react";
import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ModalWrapper = ({
  setModalIsVisible,
  children,
}: {
  children: ReactNode;
  setModalIsVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.2 },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      className="w-full h-screen fixed top-0 left-0 z-40 transition-all backdrop-blur-md"
    >
      <div
        onClick={() => setModalIsVisible(false)}
        className="w-full h-screen fixed bg-black  top-0 left-0 z-40 bg-opacity-60 transition-all"
      ></div>
      <motion.div
        className="bg-project-light-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[38rem] rounded-lg px-4 py-12
    w-[90%] z-50 flex flex-col"
        initial={{ opacity: 0, y: "-150%", x: "-50%" }}
        animate={{
          opacity: 1,
          y: "-50%",
          x: "-50%",
          transition: { duration: 0.2 },
        }}
        exit={{
          opacity: 0,
          y: "-150%",
          transition: { duration: 0.2 },
        }}
      >
        <button
          onClick={() => setModalIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400"
        >
          <IoIosCloseCircleOutline className="text-2xl" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ModalWrapper;
