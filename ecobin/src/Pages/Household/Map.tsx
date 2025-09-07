import { useState } from "react";

const HouseholdMap = () => {
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");

  const nearbyBins = [
    {
      id: "1",
      type: "plastic",
      name: "Central Park Bin",
      distance: "0.2 km",
      status: "available",
      coordinates: { lat: 40.7829, lng: -73.9654 },
    },
    {
      id: "2",
      type: "glass",
      name: "Main Street Recycling",
      distance: "0.5 km",
      status: "full",
      coordinates: { lat: 40.7831, lng: -73.9656 },
    },
    {
      id: "3",
      type: "metal",
      name: "Shopping Center",
      distance: "0.8 km",
      status: "available",
      coordinates: { lat: 40.7825, lng: -73.965 },
    },
    {
      id: "4",
      type: "paper",
      name: "Library Drop-off",
      distance: "1.2 km",
      status: "available",
      coordinates: { lat: 40.7835, lng: -73.966 },
    },
  ];

  const binTypes = [
    { type: "all", label: "All Bins", icon: "🗂️", color: "bg-gray-100" },
    { type: "plastic", label: "Plastic", icon: "🍼", color: "bg-blue-100" },
    { type: "glass", label: "Glass", icon: "🫙", color: "bg-green-100" },
    { type: "metal", label: "Metal", icon: "🥤", color: "bg-orange-100" },
    { type: "paper", label: "Paper", icon: "📄", color: "bg-yellow-100" },
  ];

  const filteredBins =
    filterType === "all"
      ? nearbyBins
      : nearbyBins.filter((bin) => bin.type === filterType);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Recycling Map</h1>
        <p className="text-white/80">
          Find the nearest recycling bins around you
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-3">
          Filter by Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {binTypes.map((type) => (
            <button
              key={type.type}
              onClick={() => setFilterType(type.type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterType === type.type
                  ? "bg-[#062f2e] text-white"
                  : `${type.color} text-[#062f2e] hover:bg-[#062f2e]/10`
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 relative flex items-center justify-center">
          {/* Placeholder for actual map integration */}
          <div className="text-center">
            <svg
              className="w-24 h-24 text-[#062f2e]/30 mx-auto mb-4"
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
            <p className="text-[#062f2e]/70 text-lg">Interactive Map</p>
            <p className="text-[#062f2e]/50 text-sm">
              Map integration will be added here
            </p>
          </div>

          {/* Sample map pins */}
          <div className="absolute top-4 left-4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute top-12 right-8 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute bottom-16 left-12 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute bottom-8 right-16 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </div>

      {/* Nearby Bins List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Nearby Bins ({filteredBins.length} found)
        </h3>
        <div className="space-y-3">
          {filteredBins.map((bin) => (
            <div
              key={bin.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedBin === bin.id
                  ? "border-[#062f2e] bg-[#062f2e]/5"
                  : "border-gray-200 hover:border-[#062f2e]/30"
              }`}
              onClick={() =>
                setSelectedBin(selectedBin === bin.id ? null : bin.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      bin.status === "available" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-medium text-[#062f2e]">{bin.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-[#062f2e]/70">
                      <span className="flex items-center space-x-1">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span>{bin.distance}</span>
                      </span>
                      <span className="capitalize">{bin.type} waste</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bin.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bin.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-[#062f2e] hover:bg-[#062f2e]/10 rounded-lg transition-colors">
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-[#062f2e] hover:bg-[#062f2e]/10 rounded-lg transition-colors">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {selectedBin === bin.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#062f2e] text-white rounded-lg hover:bg-[#083d3c] transition-colors">
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
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                        />
                      </svg>
                      <span>Get Directions</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-[#062f2e] rounded-lg hover:bg-gray-200 transition-colors">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Set Reminder</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-green-700">Bins Visited</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2.3 km</div>
            <div className="text-sm text-blue-700">Total Distance</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">45 kg</div>
            <div className="text-sm text-orange-700">Waste Recycled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdMap;
