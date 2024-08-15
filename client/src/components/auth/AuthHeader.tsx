import { FaRegBell } from "react-icons/fa";
import { IoIosSearch, IoMdHeart } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import LanguageSwitcher from "../ui/sharedComponents/LanguageSwitcher";
import { useTranslate } from "../../hooks/useTranslate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../services/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { saveUserInfo } from "../../redux/user/userSlice";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";
import { Link, useLocation } from "react-router-dom";
import {
  getNotificationsByUser,
  markAllNotificationsAsRead,
} from "../../services/notifications";
import { NotificationType } from "../../types/notification";
import { useRef, useState } from "react";
import moment from "moment";
import "moment/min/locales";
import { translations } from "../../lang/common";
import { RootState } from "../../redux/store";
import useOutsideClick from "../../hooks/useOutsideClick";
import { BsChatQuote } from "react-icons/bs";

const AuthHeader = ({
  setSidebarIsVisible,
}: {
  setSidebarIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [notificationDropdownIsVisible, setNotificationDropdownIsVisible] =
    useState(false);

  const { lang } = useSelector((state: RootState) => state.lang);
  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);
  const bellButtonRef = useRef<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();

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

  const translate = (key, count) => {
    const translation = translations[key] && translations[key][lang];
    if (!translation) return key;

    if (count !== undefined) {
      const pluralKey = `${key}_plural`;
      const pluralTranslation =
        translations[pluralKey] && translations[pluralKey][lang];
      const template =
        count > 1 && pluralTranslation ? pluralTranslation : translation;
      return template.replace("{{count}}", count);
    }

    return translation;
  };

  const timeAgo = (timestamp) => {
    const now = moment();
    const time = moment(timestamp);
    const diffInSeconds = now.diff(time, "seconds");
    const diffInMinutes = now.diff(time, "minutes");
    const diffInHours = now.diff(time, "hours");
    const diffInDays = now.diff(time, "days");
    const diffInMonths = now.diff(time, "months");
    const diffInYears = now.diff(time, "years");

    if (diffInMinutes < 1) {
      return translate("secondsAgo", diffInSeconds);
    } else if (diffInHours < 1) {
      return translate("minutesAgo", diffInMinutes);
    } else if (diffInDays < 1) {
      return translate("hoursAgo", diffInHours);
    } else if (diffInMonths < 1) {
      return translate("daysAgo", diffInDays);
    } else if (diffInYears < 1) {
      return translate("monthsAgo", diffInMonths);
    } else {
      return translate("yearsAgo", diffInYears);
    }
  };

  useOutsideClick([notificationDropdownRef, bellButtonRef], () => {
    setNotificationDropdownIsVisible(false);
  });

  const {
    mutate: markNotificationsMutate,
    isPending: markNotificationsIsPending,
  } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error(t("something_went_wrong"));
    },
  });

  return (
    <header className="bg-project-light-blue px-16 xl:px-10 lg:px-4 py-6  flex justify-between items-center fixed top-0 w-full z-40 ">
      <h1 className="text-project-yellow uppercase font-helvetica-medium lg:hidden">
        Movie Quotes
      </h1>
      <button
        className="hidden lg:inline-block"
        onClick={() => setSidebarIsVisible((currentState) => !currentState)}
      >
        <RxHamburgerMenu className="h-5 w-5" />
      </button>

      <div className="flex gap-5 items-center">
        {pathname === "/news-feed" && (
          <button className="hidden lg:inline-block">
            <IoIosSearch className="h-6 w-6" />
          </button>
        )}

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
          className="rounded w-24 border border-white text-white px-2 py-[0.4rem] lg:hidden"
          onClick={() => mutateLogout()}
        >
          {isLogoutPending ? <LoadingSpinner /> : t("logout")}
        </button>
      </div>

      {notificationDropdownIsVisible && (
        <div
          ref={notificationDropdownRef}
          className="absolute bottom-0 translate-y-full right-5 sm:right-0 bg-black max-w-[37.5rem] max-h-[25rem] overflow-auto w-full p-4 rounded"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl  sm:text-base">{t("notifications")}</h1>
            <button
              onClick={() => markNotificationsMutate()}
              className="text-sm text-gray-400 underline flex items-center gap-2"
            >
              {markNotificationsIsPending ? <LoadingSpinner /> : ""}
              {t("mark_all_as_read")}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {!notifications?.length && (
              <p className="text-center text-gray-400">
                {t("notifications_not_found")}
              </p>
            )}
            {notifications?.map((notification) => (
              <Link
                to={`/quotes/${notification?.quote}`}
                key={notification?._id}
                className="border border-gray-700 p-4 sm:p-2 rounded flex justify-between sm:flex-col gap-2"
              >
                <div className="flex items-center sm:items-start gap-2">
                  <img
                    className="h-12 w-12 sm:w-10 sm:h-10 rounded-full"
                    src={notification?.sender.image}
                    alt="asd"
                  />
                  <div className="flex flex-col gap-2 sm:text-sm">
                    <p>{notification?.sender?.username}</p>
                    <p className="flex items-center gap-1 sm:items-start">
                      {notification.type === "like" ? (
                        <>
                          <IoMdHeart className="h-6 w-6 sm:h-5 sm:w-5 fill-red-500 shrink-0" />
                          {t("reacted_your_quote")}
                        </>
                      ) : (
                        <>
                          <BsChatQuote className="h-5 w-5 sm:h-4 sm:w-4 shrink-0" />
                          {t("commented_on_your_quote")}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-sn sm:text-xs">
                  <p className="text-gray-400">
                    {timeAgo(notification?.createdAt)}
                  </p>
                  <p className="text-green-500 ">
                    {moment().diff(notification?.createdAt, "minutes") < 2
                      ? t("now")
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthHeader;
