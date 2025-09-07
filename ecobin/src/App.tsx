import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import PageNotFound from "./Components/PageNotFound.tsx";

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
