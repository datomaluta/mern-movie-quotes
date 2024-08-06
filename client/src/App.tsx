import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingLayout from "./components/layouts/LandingLayout";
import { Toaster } from "react-hot-toast";
import VerifyAccount from "./pages/VerifyAccount";
import NewsFeed from "./pages/NewsFeed";
import Profile from "./pages/Profile";
import AuthLayout from "./components/layouts/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/ui/sharedComponents/ScrollToTop";
import Movies from "./pages/Movies";
import MovieCreate from "./pages/MovieCreate";
import MovieDetails from "./pages/MovieDetails";
import MovieEdit from "./pages/MovieEdit";

function App() {
  return (
    <div className="font-helvetica-light text-white ">
      <Toaster position="bottom-left" reverseOrder={false} />
      <ScrollToTop />
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
          <Route
            path="/movies"
            element={
              <AuthLayout>
                <Movies />
              </AuthLayout>
            }
          />
          <Route
            path="/movies/create"
            element={
              <AuthLayout>
                <MovieCreate />
              </AuthLayout>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <AuthLayout>
                <MovieDetails />
              </AuthLayout>
            }
          />
          <Route
            path="/movies/edit/:id"
            element={
              <AuthLayout>
                <MovieEdit />
              </AuthLayout>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
