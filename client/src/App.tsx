import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <div className="font-helvetica-heawy">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
