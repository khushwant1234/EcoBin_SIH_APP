import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: "household" | "municipality") => {
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ee] to-[#f5f3ee]/90 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#062f2e] mb-4">
            Welcome to EcoBin
          </h1>
          <p className="text-xl text-[#062f2e]/80 mb-8">
            Smart Waste Management for Everyone
          </p>
          <p className="text-lg text-[#062f2e]/70">
            Choose your role to get started with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Household Card */}
          <div
            onClick={() => handleRoleSelection("household")}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-[#062f2e]/20"
          >
            <div className="w-20 h-20 bg-[#062f2e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#062f2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#062f2e] mb-4">
              Household
            </h2>
            <p className="text-[#062f2e]/70 mb-6">
              Manage your home waste, earn rewards, and contribute to a cleaner
              environment
            </p>
            <div className="space-y-2 text-sm text-[#062f2e]/60">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Smart Bin Scanning</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Rewards & Points</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Waste Collection Map</span>
              </div>
            </div>
            <button className="mt-6 bg-[#062f2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#083d3c] transition-colors duration-200 w-full">
              Get Started as Household
            </button>
          </div>

          {/* Municipality Card */}
          <div
            onClick={() => handleRoleSelection("municipality")}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-[#062f2e]/20"
          >
            <div className="w-20 h-20 bg-[#062f2e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#062f2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#062f2e] mb-4">
              Municipality
            </h2>
            <p className="text-[#062f2e]/70 mb-6">
              Monitor waste collection, optimize routes, and manage city-wide
              waste operations
            </p>
            <div className="space-y-2 text-sm text-[#062f2e]/60">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>City-wide Analytics</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Route Optimization</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Bin Status Monitoring</span>
              </div>
            </div>
            <button className="mt-6 bg-[#062f2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#083d3c] transition-colors duration-200 w-full">
              Get Started as Municipality
            </button>
          </div>
        </div>

        <div className="mt-12">
          <button
            onClick={() => navigate("/auth")}
            className="text-[#062f2e] hover:text-[#083d3c] font-medium underline"
          >
            Need to login or create an account?
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
