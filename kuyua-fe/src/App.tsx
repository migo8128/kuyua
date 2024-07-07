import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import Locations from "./pages/locations";

function App() {
  return (
    <div>
      <div className="px-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function NotFound() {
  return <h1>Not Found</h1>;
}

export default App;
