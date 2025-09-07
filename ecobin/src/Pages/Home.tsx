import { useState, useEffect } from "react";
import { getItem, removeItem } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getItem("token");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await removeItem("token");
      setIsLoggedIn(false);
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/90 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#062f2e] mx-auto"></div>
          <p className="mt-4 text-[#062f2e]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/90">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#062f2e]">EcoBin</h1>
          <div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-[#062f2e] text-white px-4 py-2 rounded-lg hover:bg-[#083d3c] transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-[#062f2e] text-white px-4 py-2 rounded-lg hover:bg-[#083d3c] transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#062f2e] mb-4">
            Welcome to EcoBin
          </h1>
          <p className="text-lg text-[#062f2e]/80 mb-8">
            Your smart waste management solution
          </p>

          {isLoggedIn && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
              <p className="font-semibold">✅ You are logged in!</p>
              <p className="text-sm">You can now access all EcoBin features.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#062f2e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#062f2e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#062f2e] mb-2">
                  Smart Bins
                </h3>
                <p className="text-[#062f2e]/70">
                  Monitor waste levels in real-time with IoT-enabled smart bins
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#062f2e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#062f2e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#062f2e] mb-2">
                  Analytics
                </h3>
                <p className="text-[#062f2e]/70">
                  Get insights into waste generation patterns and optimize
                  collection
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#062f2e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#062f2e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#062f2e] mb-2">
                  Efficiency
                </h3>
                <p className="text-[#062f2e]/70">
                  Reduce costs and environmental impact through smart routing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
