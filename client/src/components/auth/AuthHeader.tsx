import { FaRegBell } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import LanguageSwitcher from "../ui/sharedComponents/LanguageSwitcher";
import { useTranslate } from "../../hooks/useTranslate";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../services/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../redux/user/userSlice";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";

const AuthHeader = ({
  setSidebarIsVisible,
}: {
  setSidebarIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslate();
  const dispatch = useDispatch();

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
    <header className="bg-project-light-blue px-16 xl:px-10 lg:px-8 py-6  flex justify-between items-center fixed top-0 w-full z-50">
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
        <button className="hidden lg:inline-block">
          <IoIosSearch className="h-6 w-6" />
        </button>

        <button className="relative">
          <FaRegBell className="h-6 lg:h-5 w-6 lg:w-5" />
          <span className="bg-project-red absolute -top-[30%] -right-[35%] w-5 lg:w-4 h-5 lg:h-4 text-xs flex justify-center items-center  rounded-full text-center font-helvetica-medium ">
            9
          </span>
        </button>

        <LanguageSwitcher className="lg:hidden" />

        <button
          className="rounded w-24 border border-white text-white px-2 py-[7px] lg:hidden"
          onClick={() => mutateLogout()}
        >
          {isLogoutPending ? <LoadingSpinner /> : t("logout")}
        </button>
      </div>
    </header>
  );
};

export default AuthHeader;
