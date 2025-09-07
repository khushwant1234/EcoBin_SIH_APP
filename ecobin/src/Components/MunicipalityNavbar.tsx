import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const MunicipalityNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data and redirect to auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const navItems = [
    { to: "/municipality/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/municipality/map", label: "City Map", icon: "🗺️" },
    { to: "/municipality/profile", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#062f2e] rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M9 7h6m-6 4h6m-6 4h6"
                />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-[#062f2e]">EcoBin</span>
              <span className="text-xs text-[#062f2e]/70 block -mt-1">
                Municipality Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? "bg-[#062f2e] text-white"
                      : "text-[#062f2e] hover:bg-[#062f2e]/10"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-[#062f2e]/70 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>12 Alerts</span>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 text-[#062f2e]">
              <div className="w-8 h-8 bg-[#062f2e]/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M9 7h6m-6 4h6m-6 4h6"
                  />
                </svg>
              </div>
              <div className="text-sm">
                <div className="font-medium">Municipality</div>
                <div className="text-[#062f2e]/60 text-xs">Administrator</div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-[#062f2e] hover:bg-[#062f2e]/10 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
              {/* System Status (Mobile) */}
              <div className="px-3 py-2 border-b border-gray-200 mb-2">
                <div className="flex items-center justify-between text-sm text-[#062f2e]/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>System Online</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <span>12 Alerts</span>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-[#062f2e] text-white"
                        : "text-[#062f2e] hover:bg-[#062f2e]/10"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {/* User Info & Logout */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center space-x-3 px-3 py-2 text-[#062f2e]">
                  <div className="w-8 h-8 bg-[#062f2e]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M9 7h6m-6 4h6m-6 4h6"
                      />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Municipality Admin</div>
                    <div className="text-[#062f2e]/60">
                      System Administrator
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MunicipalityNavbar;
