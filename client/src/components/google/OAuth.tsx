import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { googleAuth } from "../../services/auth";
import { app } from "../../firebase.ts";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { useTranslate } from "../../hooks/useTranslate.ts";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../redux/user/userSlice.ts";
import { UserType } from "../../types/user";

const OAuth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { t } = useTranslate();
  const dispatch = useDispatch();

  const { mutate: googleAuthMutate } = useMutation({
    mutationFn: googleAuth,
    onSuccess: (response: { data: { data: { user: UserType } } }) => {
      dispatch(saveUserInfo(response?.data?.data?.user));
      navigate("/news-feed");
    },
    onError: () => {
      toast.error("Sign in failed, Something went wrong!");
    },
  });

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const resultsFromGoogle = await signInWithPopup(auth, provider);
    console.log(resultsFromGoogle);
    googleAuthMutate({
      username: resultsFromGoogle.user.displayName as string,
      email: resultsFromGoogle.user.email as string,
      googlePhotoUrl: resultsFromGoogle.user.photoURL as string,
    });
  };

  return (
    // <button
    //   onClick={handleGoogleClick}
    //   className="flex gap-2 items-center border border-zinc-300 dark:border-zinc-600 p-2 rounded-lg mx-auto mt-3 hover:bg-dark-gray hover:dark:bg-dark-gray-shade hover:text-white hover: transition-all"
    // >
    //   <FcGoogle />
    //   Google
    // </button>

    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full border border-white py-2 md:py-[6px] rounded flex gap-2 items-center justify-center mt-4 md:mt-2"
    >
      <FaGoogle />
      {t("sign_up_with_google")}
    </button>
  );
};

export default OAuth;
