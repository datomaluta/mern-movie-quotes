import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingLayout from "./components/layouts/LandingLayout";
import { Toaster } from "react-hot-toast";
import VerifyAccount from "./pages/VerifyAccount";
import NewsFeed from "./pages/NewsFeed";
import Profile from "./pages/Profile";
import AuthLayout from "./components/layouts/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div className="font-helvetica-light text-white ">
      <Toaster position="bottom-left" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <LandingLayout>
              <Home />
            </LandingLayout>
          }
        />
        <Route path="/verify/:token" element={<VerifyAccount />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/news-feed"
            element={
              <AuthLayout>
                <NewsFeed />
              </AuthLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthLayout>
                <Profile />
              </AuthLayout>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
