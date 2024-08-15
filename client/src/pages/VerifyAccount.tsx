import { useMutation } from "@tanstack/react-query";
import { verifyUser } from "../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "../components/ui/sharedComponents/LoadingSpinner";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../redux/user/userSlice";

const VerifyAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: verifyUser,
    onSuccess: (response: any) => {
      navigate("/?action=account-verified");
      dispatch(saveUserInfo(response?.data?.data?.user));
    },
    onError: () => {
      navigate("/?action=verify-link-expired");
    },
  });

  useEffect(() => {
    if (token) mutate(token);
  }, [token, mutate]);

  return (
    <div className=" bg-project-dark-blue min-h-screen">
      {isPending ? (
        <div className="pt-32 flex justify-center">
          <LoadingSpinner className="text-3xl" />
        </div>
      ) : null}
    </div>
  );
};

export default VerifyAccount;
