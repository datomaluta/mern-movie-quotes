import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingLayout from "./components/layouts/LandingLayout";
import { Toaster } from "react-hot-toast";
import VerifyAccount from "./pages/VerifyAccount";
import NewsFeed from "./pages/NewsFeed";
import NewsFeedLayout from "./components/layouts/NewsFeedLayout";

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
        <Route
          path="/news-feed"
          element={
            <NewsFeedLayout>
              <NewsFeed />
            </NewsFeedLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
