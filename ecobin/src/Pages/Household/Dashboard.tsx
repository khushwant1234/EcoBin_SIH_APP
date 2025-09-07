import { useState } from "react";

const HouseholdDashboard = () => {
  const [stats] = useState({
    totalWaste: 45.5,
    pointsEarned: 1250,
    recyclingRate: 78,
    nextPickup: "Tomorrow, 9:00 AM",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-white/80">Here's your waste management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Total Waste
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.totalWaste} kg
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Points Earned
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.pointsEarned}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Recycling Rate
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.recyclingRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Next Pickup
              </p>
              <p className="text-lg font-bold text-[#062f2e]">
                {stats.nextPickup}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
            Recent Scans
          </h3>
          <div className="space-y-3">
            {[
              { type: "Plastic Bottle", points: 10, time: "2 hours ago" },
              { type: "Aluminum Can", points: 15, time: "1 day ago" },
              { type: "Glass Jar", points: 20, time: "2 days ago" },
            ].map((scan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-[#062f2e]">{scan.type}</p>
                  <p className="text-sm text-[#062f2e]/70">{scan.time}</p>
                </div>
                <div className="text-green-600 font-semibold">
                  +{scan.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors">
              <svg
                className="w-8 h-8 text-[#062f2e] mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4"
                />
              </svg>
              <span className="text-sm font-medium text-[#062f2e]">
                Scan Item
              </span>
            </button>
            <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors">
              <svg
                className="w-8 h-8 text-[#062f2e] mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-[#062f2e]">
                Find Bins
              </span>
            </button>
            <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors">
              <svg
                className="w-8 h-8 text-[#062f2e] mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span className="text-sm font-medium text-[#062f2e]">
                Rewards
              </span>
            </button>
            <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors">
              <svg
                className="w-8 h-8 text-[#062f2e] mx-auto mb-2"
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
              <span className="text-sm font-medium text-[#062f2e]">
                Reports
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Weekly Waste Summary
        </h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
            const height = Math.random() * 60 + 20;
            return (
              <div key={day} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-[#062f2e] rounded-t-md"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-sm text-[#062f2e]/70 mt-2">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HouseholdDashboard;
