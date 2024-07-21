import { ReactNode, useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { AnimatePresence, motion } from "framer-motion";
import NewsFeedHeader from "../newsFeed/NewsFeedHeader";
import SidebarContent from "../sidebar/SidebarContent";
import { useTranslate } from "../../hooks/useTranslate";
import { IoIosLogOut } from "react-icons/io";
import LanguageToggle from "../ui/LanguageToggle";

const NewsFeedLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslate();

  useOutsideClick([sidebarRef], () => {
    if (window.innerWidth <= 1023) setSidebarIsVisible(false);
  });

  return (
    <>
      <NewsFeedHeader setSidebarIsVisible={setSidebarIsVisible} />

      <div className="mt-[88px] pt-8 flex ">
        {/* sidebar */}
        <div className="w-[420px] xl:w-[250px]  h-screen fixed lg:hidden px-16 xl:px-10 lg:px-8">
          <SidebarContent />
        </div>

        <AnimatePresence>
          {sidebarIsVisible && (
            <motion.div
              ref={sidebarRef}
              className="max-w-[350px] w-[80%] h-screen fixed top-0 left-0 bg-project-dark-blue p-4 hidden lg:flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
              exit={{ x: "-100%" }}
            >
              <SidebarContent />

              <div className="mt-auto flex flex-col gap-5">
                <LanguageToggle />
                <button className="w-full bg-project-light-blue px-4 py-2 rounded text-left flex gap-2 items-center text-gray-500 hover:bg-project-dark-blue hover:border-project-gray border border-transparent transition-all">
                  <IoIosLogOut className="text-xl" />
                  {t("logout")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* main content */}
        <div className="bg-blue-600 flex-1 max-w-[938px] lg:w-full lg:max-w-full ml-[420px] xl:ml-[250px] lg:ml-0 p-4">
          THIS IS MAIN CONTENT
          {children}
        </div>
      </div>
    </>
  );
};
export default NewsFeedLayout;
