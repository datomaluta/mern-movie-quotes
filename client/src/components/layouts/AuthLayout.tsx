import { ReactNode, useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { AnimatePresence, motion } from "framer-motion";
import SidebarContent from "../auth/sidebar/SidebarContent";
import { useTranslate } from "../../hooks/useTranslate";
import { IoIosLogOut } from "react-icons/io";
import LanguageToggle from "../ui/sharedComponents/LanguageToggle";
import AuthHeader from "../auth/AuthHeader";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../services/auth";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { saveUserInfo } from "../../redux/user/userSlice";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarIsVisible, setSidebarIsVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslate();
  const dispatch = useDispatch();

  useOutsideClick([sidebarRef], () => {
    if (window.innerWidth <= 1023) setSidebarIsVisible(false);
  });

  const { mutate: mutateLogout, isPending: isLogoutPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(saveUserInfo(null));
    },
    onError: () => {
      toast.error(t("something_went_wrong"));
    },
  });

  return (
    <>
      <AuthHeader setSidebarIsVisible={setSidebarIsVisible} />

      <div className="mt-[5.5rem] xl:mt-[4.5rem] pt-8 flex bg-project-middle-blue min-h-screen">
        {/* sidebar */}
        <aside className="w-[26.25rem] xl:w-[15.625rem] h-screen fixed lg:hidden px-16 xl:px-10 lg:px-8">
          <SidebarContent />
        </aside>

        <AnimatePresence>
          {sidebarIsVisible && (
            <motion.aside
              ref={sidebarRef}
              className="max-w-[22rem] w-[80%] h-screen fixed top-0 left-0 bg-project-dark-blue p-4 hidden lg:flex flex-col z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
              exit={{ x: "-100%" }}
            >
              <SidebarContent />

              <div className="mt-auto flex flex-col gap-5">
                <LanguageToggle />
                <button
                  className="w-full bg-project-light-blue px-4 py-2 rounded text-left flex gap-2 items-center text-gray-500 hover:bg-project-dark-blue hover:border-project-gray border border-transparent transition-all"
                  onClick={() => mutateLogout()}
                >
                  {isLogoutPending ? (
                    <LoadingSpinner />
                  ) : (
                    <IoIosLogOut className="text-xl" />
                  )}
                  {t("logout")}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* main content */}
        <div className="bg-blue-60 flex-1 max-w-[58.625rem] lg:w-full lg:max-w-full ml-[26.25rem] xl:ml-[15.625rem] lg:ml-0  px-4 pb-4">
          {children}
        </div>
      </div>
    </>
  );
};
export default AuthLayout;
