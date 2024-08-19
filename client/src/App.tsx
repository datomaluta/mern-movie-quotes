import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import VerifyAccount from "./pages/VerifyAccount";
import NewsFeed from "./pages/NewsFeed";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/ui/sharedComponents/ScrollToTop";
import Movies from "./pages/Movies";
import MovieCreate from "./pages/MovieCreate";
import MovieDetails from "./pages/MovieDetails";
import MovieEdit from "./pages/MovieEdit";
import QuoteCreate from "./pages/QuoteCreate";
import QuoteEdit from "./pages/QuoteEdit";
import QuoteView from "./pages/QuoteView";
import SearchedQuotes from "./pages/SearchedQuotes";
import { SocketProvider } from "./context/SocketContext";

function App() {
  // useSocket();

  return (
    <SocketProvider>
      <div className="font-helvetica-light text-white ">
        <Toaster position="bottom-left" reverseOrder={false} />
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify/:token" element={<VerifyAccount />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/news-feed" element={<NewsFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies-search" element={<Movies />} />
            <Route path="/movies/create" element={<MovieCreate />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/movies/edit/:id" element={<MovieEdit />} />
            <Route
              path="/movies/:movieId/quotes/create"
              element={<QuoteCreate />}
            />
            <Route path="/quotes/create" element={<QuoteCreate />} />
            <Route path="/quotes/edit/:quoteId" element={<QuoteEdit />} />
            <Route
              path="/movies/:movieId/quotes/edit/:quoteId"
              element={<QuoteEdit />}
            />
            <Route path="/quotes/:id" element={<QuoteView />} />
            <Route path="/quotes/search" element={<SearchedQuotes />} />
          </Route>
        </Routes>
      </div>
    </SocketProvider>
  );
}

export default App;
