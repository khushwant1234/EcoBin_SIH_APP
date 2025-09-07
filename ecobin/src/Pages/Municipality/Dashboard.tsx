import { useState } from "react";

const MunicipalityDashboard = () => {
  const [stats] = useState({
    totalBins: 245,
    activeUsers: 1847,
    wasteCollected: "12.5 tons",
    completionRate: 89,
    alertsCount: 12,
    scheduledPickups: 34,
  });

  const [recentAlerts] = useState([
    {
      id: 1,
      type: "bin_full",
      location: "Central Park Bin #42",
      time: "10 minutes ago",
      priority: "high",
    },
    {
      id: 2,
      type: "maintenance",
      location: "Main Street Bin #15",
      time: "1 hour ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "damage",
      location: "Shopping Center Bin #8",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 4,
      type: "bin_full",
      location: "Library Bin #23",
      time: "3 hours ago",
      priority: "medium",
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-orange-600 bg-orange-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "bin_full":
        return "🗑️";
      case "maintenance":
        return "🔧";
      case "damage":
        return "⚠️";
      default:
        return "📍";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Municipality Dashboard</h1>
        <p className="text-white/80">
          Monitor and manage waste collection across your city
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Total Bins
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.totalBins}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
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

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Active Users
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.activeUsers.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Waste Collected
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.wasteCollected}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.completionRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Active Alerts
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.alertsCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#062f2e]/70 text-sm font-medium">
                Scheduled Pickups
              </p>
              <p className="text-2xl font-bold text-[#062f2e]">
                {stats.scheduledPickups}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#062f2e]">
              Recent Alerts
            </h3>
            <button className="text-[#062f2e] hover:underline text-sm">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-xl">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#062f2e]">
                    {alert.location}
                  </h4>
                  <p className="text-sm text-[#062f2e]/70">{alert.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    alert.priority
                  )}`}
                >
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
            Today's Collection Schedule
          </h3>
          <div className="space-y-3">
            {[
              {
                route: "Route A - Downtown",
                time: "08:00",
                status: "completed",
                progress: 100,
              },
              {
                route: "Route B - Residential",
                time: "10:30",
                status: "in_progress",
                progress: 65,
              },
              {
                route: "Route C - Industrial",
                time: "14:00",
                status: "pending",
                progress: 0,
              },
              {
                route: "Route D - Commercial",
                time: "16:30",
                status: "pending",
                progress: 0,
              },
            ].map((route, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[#062f2e]">{route.route}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      route.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : route.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {route.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#062f2e]/70">
                    {route.time}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        route.status === "completed"
                          ? "bg-green-500"
                          : route.status === "in_progress"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                      style={{ width: `${route.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-[#062f2e]/70">
                    {route.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bin Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Bin Status Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              status: "Empty",
              count: 142,
              color: "bg-green-500",
              percentage: 58,
            },
            {
              status: "Partial",
              count: 67,
              color: "bg-yellow-500",
              percentage: 27,
            },
            {
              status: "Full",
              count: 24,
              color: "bg-orange-500",
              percentage: 10,
            },
            {
              status: "Overflow",
              count: 12,
              color: "bg-red-500",
              percentage: 5,
            },
          ].map((item) => (
            <div key={item.status} className="text-center">
              <div
                className={`w-20 h-20 ${item.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold`}
              >
                {item.count}
              </div>
              <h4 className="font-medium text-[#062f2e]">{item.status} Bins</h4>
              <p className="text-sm text-[#062f2e]/70">
                {item.percentage}% of total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors group">
            <svg
              className="w-8 h-8 text-[#062f2e] mx-auto mb-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
            <span className="text-sm font-medium text-[#062f2e]">
              Schedule Route
            </span>
          </button>

          <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors group">
            <svg
              className="w-8 h-8 text-[#062f2e] mx-auto mb-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-[#062f2e]">
              Add New Bin
            </span>
          </button>

          <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors group">
            <svg
              className="w-8 h-8 text-[#062f2e] mx-auto mb-2 group-hover:scale-110 transition-transform"
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
              Generate Report
            </span>
          </button>

          <button className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 rounded-lg text-center transition-colors group">
            <svg
              className="w-8 h-8 text-[#062f2e] mx-auto mb-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-medium text-[#062f2e]">
              System Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MunicipalityDashboard;
