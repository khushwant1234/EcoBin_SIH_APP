import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import GetStarted from "./Pages/GetStarted";
import PageNotFound from "./Components/PageNotFound.tsx";

// Household Pages
import HouseholdNavbar from "./Components/HouseholdNavbar";
import HouseholdDashboard from "./Pages/Household/Dashboard";
import HouseholdRewards from "./Pages/Household/Rewards";
import HouseholdMap from "./Pages/Household/Map";
import HouseholdScan from "./Pages/Household/Scan";
import HouseholdProfile from "./Pages/Household/Profile";
import HouseholdReports from "./Pages/Household/Reports";

// Municipality Pages
import MunicipalityNavbar from "./Components/MunicipalityNavbar";
import MunicipalityDashboard from "./Pages/Municipality/Dashboard";
import MunicipalityMap from "./Pages/Municipality/Map";
import MunicipalityProfile from "./Pages/Municipality/Profile";

// Layout Wrapper Components
const HouseholdLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <HouseholdNavbar />
    {children}
  </>
);

const MunicipalityLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <MunicipalityNavbar />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-center" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/get-started" element={<GetStarted />} />

        {/* Household Routes */}
        <Route
          path="/household/dashboard"
          element={
            <HouseholdLayout>
              <HouseholdDashboard />
            </HouseholdLayout>
          }
        />
        <Route
          path="/household/scan"
          element={
            <HouseholdLayout>
              <HouseholdScan />
            </HouseholdLayout>
          }
        />
        <Route
          path="/household/map"
          element={
            <HouseholdLayout>
              <HouseholdMap />
            </HouseholdLayout>
          }
        />
        <Route
          path="/household/rewards"
          element={
            <HouseholdLayout>
              <HouseholdRewards />
            </HouseholdLayout>
          }
        />
        <Route
          path="/household/profile"
          element={
            <HouseholdLayout>
              <HouseholdProfile />
            </HouseholdLayout>
          }
        />
        <Route
          path="/household/reports"
          element={
            <HouseholdLayout>
              <HouseholdReports />
            </HouseholdLayout>
          }
        />

        {/* Municipality Routes */}
        <Route
          path="/municipality/dashboard"
          element={
            <MunicipalityLayout>
              <MunicipalityDashboard />
            </MunicipalityLayout>
          }
        />
        <Route
          path="/municipality/map"
          element={
            <MunicipalityLayout>
              <MunicipalityMap />
            </MunicipalityLayout>
          }
        />
        <Route
          path="/municipality/profile"
          element={
            <MunicipalityLayout>
              <MunicipalityProfile />
            </MunicipalityLayout>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
