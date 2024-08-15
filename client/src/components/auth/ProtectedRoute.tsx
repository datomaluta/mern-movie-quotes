import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

const ProtectedRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return currentUser ? (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ) : (
    <Navigate to={"/"} />
  );
};

export default ProtectedRoute;
