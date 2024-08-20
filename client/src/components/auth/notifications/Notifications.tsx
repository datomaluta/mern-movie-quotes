import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../../../services/notifications";
import toast from "react-hot-toast";
import { translations } from "../../../lang/common";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useTranslate } from "../../../hooks/useTranslate";
import moment from "moment";
import LoadingSpinner from "../../ui/sharedComponents/LoadingSpinner";
import { Link } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import { BsChatQuote } from "react-icons/bs";
import { NotificationType } from "../../../types/notification";

const Notifications = ({
  notifications,
  dropdownRef,
}: {
  notifications: NotificationType[] | undefined;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) => {
  const { t } = useTranslate();
  const queryClient = useQueryClient();
  const { lang } = useSelector((state: RootState) => state.lang);
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

  return (
    <div
      ref={dropdownRef}
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
            className={`border border-gray-700 ${
              notification.isRead ? "opacity-70" : ""
            } p-4 sm:p-2 rounded flex justify-between sm:flex-col gap-2`}
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
  );
};

export default Notifications;
