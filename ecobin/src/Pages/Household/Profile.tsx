import { useState } from "react";

const HouseholdProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Green Street, Eco City, EC 12345",
    memberSince: "January 2024",
  });

  const [stats] = useState({
    totalPoints: 1250,
    itemsScanned: 47,
    wasteRecycled: "45.5 kg",
    carbonSaved: "12.3 kg CO2",
    rank: "Eco Warrior",
    level: 3,
  });

  const [achievements] = useState([
    {
      id: 1,
      name: "First Scan",
      description: "Scanned your first item",
      date: "Jan 15, 2024",
      icon: "🎯",
    },
    {
      id: 2,
      name: "Plastic Warrior",
      description: "Recycled 20 plastic items",
      date: "Jan 25, 2024",
      icon: "🍼",
    },
    {
      id: 3,
      name: "Point Collector",
      description: "Earned 1000 points",
      date: "Feb 10, 2024",
      icon: "⭐",
    },
    {
      id: 4,
      name: "Weekly Champion",
      description: "Top recycler of the week",
      date: "Feb 18, 2024",
      icon: "🏆",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userInfo.name}</h1>
            <p className="text-white/80">
              {stats.rank} • Level {stats.level}
            </p>
            <p className="text-white/60 text-sm">
              Member since {userInfo.memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {stats.totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-[#062f2e]/70">Total Points</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {stats.itemsScanned}
          </div>
          <div className="text-sm text-[#062f2e]/70">Items Scanned</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {stats.wasteRecycled}
          </div>
          <div className="text-sm text-[#062f2e]/70">Waste Recycled</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#062f2e]">
            {stats.carbonSaved}
          </div>
          <div className="text-sm text-[#062f2e]/70">CO2 Saved</div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#062f2e]">
            Personal Information
          </h3>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="px-4 py-2 bg-[#062f2e] text-white rounded-lg hover:bg-[#083d3c] transition-colors"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {userInfo.name}
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
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {userInfo.email}
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
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {userInfo.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062f2e]/70 mb-2">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={userInfo.address}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, address: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062f2e] focus:border-transparent"
              />
            ) : (
              <p className="p-3 bg-gray-50 rounded-lg text-[#062f2e]">
                {userInfo.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-6">
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
            >
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#062f2e]">
                  {achievement.name}
                </h4>
                <p className="text-sm text-[#062f2e]/70 mb-1">
                  {achievement.description}
                </p>
                <p className="text-xs text-[#062f2e]/50">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-6">
          Settings & Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-[#062f2e]">
                Email Notifications
              </h4>
              <p className="text-sm text-[#062f2e]/70">
                Receive updates about rewards and achievements
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#062f2e]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#062f2e]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-[#062f2e]">Location Services</h4>
              <p className="text-sm text-[#062f2e]/70">
                Help find nearby recycling bins
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#062f2e]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#062f2e]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-[#062f2e]">Weekly Reports</h4>
              <p className="text-sm text-[#062f2e]/70">
                Get weekly recycling summaries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#062f2e]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#062f2e]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-6">
          Account Actions
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
              <span>Change Password</span>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export Data</span>
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete Account</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseholdProfile;
