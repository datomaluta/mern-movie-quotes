import { FaRegBell } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import LanguageSwitcher from "../ui/sharedComponents/LanguageSwitcher";
import { useTranslate } from "../../hooks/useTranslate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "../../services/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../redux/user/userSlice";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { getNotificationsByUser } from "../../services/notifications";
import { NotificationType } from "../../types/notification";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import Notifications from "./notifications/Notifications";
import { AnimatePresence, motion } from "framer-motion";

const AuthHeader = ({
  setSidebarIsVisible,
}: {
  setSidebarIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationDropdownIsVisible, setNotificationDropdownIsVisible] =
    useState(false);
  const [searchIsActive, setSearchIsActive] = useState(false);
  const [searchState, setSearchState] = useState<string>("");

  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);
  const bellButtonRef = useRef<HTMLButtonElement | null>(null);

  const { mutate: mutateLogout, isPending: isLogoutPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(saveUserInfo(null));
    },
    onError: () => {
      toast.error(t("something_went_wrong"));
    },
  });

  const { data: notifications } = useQuery<NotificationType[]>({
    queryKey: ["notifications"],
    queryFn: () =>
      getNotificationsByUser().then((res) => res.data?.data?.notifications),
  });

  useOutsideClick([notificationDropdownRef, bellButtonRef], () => {
    setNotificationDropdownIsVisible(false);
  });

  const submitSearch = () => {
    if (searchState.startsWith("@")) {
      navigate(
        `/movies-search?search=${searchState.substring(
          1
        )}&searchFields=title.en,title.ka`
      );
    } else if (searchState.startsWith("#")) {
      navigate(
        `/quotes/search?search=${searchState.substring(
          1
        )}&searchFields=text.en,text.ka`
      );
    } else {
      setSearchIsActive(false);
    }
  };

  return (
    <header className="bg-project-light-blue px-16 xl:px-10 lg:px-4 py-6  flex justify-between items-center fixed top-0 w-full z-40 gap-4">
      <h1 className="text-project-yellow uppercase font-helvetica-medium lg:hidden">
        Movie Quotes
      </h1>
      <button
        className="hidden lg:inline-block"
        onClick={() => setSidebarIsVisible((currentState) => !currentState)}
      >
        <RxHamburgerMenu className="h-5 w-5" />
      </button>

      <div className="flex gap-5 lg:gap-3 items-center flex-1  justify-end">
        <AnimatePresence>
          {!searchIsActive && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchIsActive(true)}
              className="hidden lg:inline-block"
            >
              <IoIosSearch className="h-7 w-7" />
            </motion.button>
          )}

          {searchIsActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full border-b border-gray-700 h-7 hidden lg:block"
            >
              <button onClick={submitSearch}>
                <IoIosSearch className="h-5 w-5 absolute top-1/2 left- -translate-y-1/2" />
              </button>
              <input
                onChange={(e) => setSearchState(e.target.value)}
                type="text"
                className="w-full bg-transparent  pl-8 py-1 outline-none sm:text-xs"
                placeholder={t("news_feed_search_placeholder")}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          ref={bellButtonRef}
          onClick={() =>
            setNotificationDropdownIsVisible((currState) => !currState)
          }
          className="relative"
        >
          <FaRegBell className="h-6  w-6 " />
          {notifications?.filter((n) => !n.isRead)?.length ? (
            <span className="bg-project-red absolute -top-[30%] -right-[35%] w-5  h-5  text-xs flex justify-center items-center  rounded-full text-center font-helvetica-medium ">
              {notifications?.filter((n) => !n.isRead)?.length < 9
                ? notifications?.filter((n) => !n.isRead)?.length
                : "9+"}
            </span>
          ) : (
            ""
          )}
        </button>

        <LanguageSwitcher className="lg:hidden" />

        <button
          className="rounded w-24 border border-white text-white px-2 py-[0.4rem] lg:hidden flex justify-center min-h-10 items-center"
          onClick={() => mutateLogout()}
        >
          {isLogoutPending ? <LoadingSpinner /> : t("logout")}
        </button>
      </div>

      {notificationDropdownIsVisible && (
        <Notifications
          notifications={notifications}
          dropdownRef={notificationDropdownRef}
        />
      )}
    </header>
  );
};

export default AuthHeader;
