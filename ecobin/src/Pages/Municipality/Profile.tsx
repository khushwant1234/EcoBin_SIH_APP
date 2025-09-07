import { useState } from "react";

const MunicipalityProfile = () => {
  const [municipalityInfo, setMunicipalityInfo] = useState({
    name: "Green City Municipality",
    email: "admin@greencity.gov",
    phone: "+1 (555) 987-6543",
    address: "123 City Hall Avenue, Green City, GC 54321",
    website: "www.greencity.gov",
    establishedDate: "March 2023",
    adminName: "Jane Smith",
    adminTitle: "Waste Management Director",
  });

  const [operationalStats] = useState({
    totalBins: 245,
    activeUsers: 1847,
    wasteProcessed: "127.5 tons",
    co2Reduced: "45.2 tons",
    recyclingRate: "89%",
    coverage: "25 km²",
    efficiency: "94%",
  });

  const [systemSettings, setSystemSettings] = useState({
    alertsEnabled: true,
    autoScheduling: true,
    realTimeTracking: true,
    dataSharing: false,
    maintenanceMode: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleSettingChange = (setting: string) => {
    setSystemSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
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
            <h1 className="text-2xl font-bold">{municipalityInfo.name}</h1>
            <p className="text-white/80">Municipal Waste Management System</p>
            <p className="text-white/60 text-sm">
              Active since {municipalityInfo.establishedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Operational Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.totalBins}
          </div>
          <div className="text-sm text-[#062f2e]/70">Total Bins</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.activeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-[#062f2e]/70">Active Users</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.wasteProcessed}
          </div>
          <div className="text-sm text-[#062f2e]/70">Waste Processed</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.co2Reduced}
          </div>
          <div className="text-sm text-[#062f2e]/70">CO2 Reduced</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.recyclingRate}
          </div>
          <div className="text-sm text-[#062f2e]/70">Recycling Rate</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.coverage}
          </div>
          <div className="text-sm text-[#062f2e]/70">Coverage Area</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {operationalStats.efficiency}
          </div>
          <div className="text-sm text-[#062f2e]/70">Efficiency</div>
        </div>
      </div>

      {/* Municipality Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#062f2e]">
            Municipality Information
          </h3>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="px-4 py-2 bg-[#062f2e] text-white rounded-lg hover:bg-[#083d3c] transition-colors"
          >
            {isEditing ? "Save Changes" : "Edit Information"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Municipality Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={municipalityInfo.name}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    name: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={municipalityInfo.email}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    email: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={municipalityInfo.phone}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    phone: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                value={municipalityInfo.website}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    website: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.website}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={municipalityInfo.address}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    address: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.address}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Administrator Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={municipalityInfo.adminName}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    adminName: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.adminName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Administrator Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={municipalityInfo.adminTitle}
                onChange={(e) =>
                  setMunicipalityInfo({
                    ...municipalityInfo,
                    adminTitle: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {municipalityInfo.adminTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-6">
          System Settings
        </h3>
        <div className="space-y-4">
          {[
            {
              key: "alertsEnabled",
              label: "Real-time Alerts",
              description:
                "Receive instant notifications for bin status changes",
            },
            {
              key: "autoScheduling",
              label: "Automatic Scheduling",
              description: "AI-powered route optimization and scheduling",
            },
            {
              key: "realTimeTracking",
              label: "Real-time Tracking",
              description: "Live tracking of collection vehicles and status",
            },
            {
              key: "dataSharing",
              label: "Data Sharing",
              description: "Share anonymized data with environmental research",
            },
            {
              key: "maintenanceMode",
              label: "Maintenance Mode",
              description:
                "Enable system maintenance mode (disables public access)",
            },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-[#062f2e]">{setting.label}</h4>
                <p className="text-sm text-[#062f2e]/70">
                  {setting.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    systemSettings[setting.key as keyof typeof systemSettings]
                  }
                  onChange={() => handleSettingChange(setting.key)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#062f2e]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#062f2e]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* API & Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-6">
          API & Integration
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#062f2e]">API Key</h4>
              <button className="text-[#062f2e] hover:underline text-sm">
                Regenerate
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-200 px-3 py-1 rounded text-sm text-[#062f2e] flex-1">
                api_key_abc123def456ghi789jkl012mno345
              </code>
              <button className="p-2 text-[#062f2e] hover:bg-gray-200 rounded">
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-[#062f2e] mb-2">Webhook URL</h4>
              <input
                type="url"
                placeholder="https://your-system.com/webhook"
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-[#062f2e] mb-2">Data Export</h4>
              <button className="w-full bg-[#062f2e] text-white py-2 rounded hover:bg-[#083d3c] transition-colors">
                Download CSV Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-6">
          Security & Access
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-[#062f2e]">
            <div className="flex items-center space-x-3">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Change Administrator Password</span>
            </div>
          </button>

          <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-[#062f2e]">
            <div className="flex items-center space-x-3">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <span>Manage User Access</span>
            </div>
          </button>

          <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-[#062f2e]">
            <div className="flex items-center space-x-3">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Security Logs</span>
            </div>
          </button>

          <button className="w-full text-left p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600">
            <div className="flex items-center space-x-3">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>Reset System Configuration</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MunicipalityProfile;
