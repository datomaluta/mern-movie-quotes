import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingLayout from "./components/layouts/LandingLayout";

function App() {
  return (
    <div className="font-helvetica-light text-white">
      <Routes>
        <Route
          path="/"
          element={
            <LandingLayout>
              <Home />
            </LandingLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
