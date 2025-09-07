import { useState } from "react";

const MunicipalityMap = () => {
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [mapView, setMapView] = useState("bins"); // bins, routes, heatmap

  const allBins = [
    {
      id: "1",
      name: "Central Park #42",
      type: "plastic",
      status: "full",
      location: "Central Park",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      lastEmptied: "2 days ago",
      capacity: 95,
    },
    {
      id: "2",
      name: "Main Street #15",
      type: "mixed",
      status: "maintenance",
      location: "Main Street",
      coordinates: { lat: 40.7831, lng: -73.9656 },
      lastEmptied: "1 day ago",
      capacity: 60,
    },
    {
      id: "3",
      name: "Shopping Center #8",
      type: "glass",
      status: "damaged",
      location: "Shopping Mall",
      coordinates: { lat: 40.7825, lng: -73.965 },
      lastEmptied: "3 days ago",
      capacity: 80,
    },
    {
      id: "4",
      name: "Library #23",
      type: "paper",
      status: "partial",
      location: "Public Library",
      coordinates: { lat: 40.7835, lng: -73.966 },
      lastEmptied: "Today",
      capacity: 45,
    },
    {
      id: "5",
      name: "City Hall #01",
      type: "mixed",
      status: "empty",
      location: "City Hall",
      coordinates: { lat: 40.784, lng: -73.9665 },
      lastEmptied: "Today",
      capacity: 15,
    },
    {
      id: "6",
      name: "School District #12",
      type: "plastic",
      status: "partial",
      location: "Elementary School",
      coordinates: { lat: 40.782, lng: -73.9645 },
      lastEmptied: "1 day ago",
      capacity: 55,
    },
  ];

  const statusTypes = [
    {
      status: "all",
      label: "All Bins",
      count: allBins.length,
      color: "bg-gray-100",
    },
    {
      status: "empty",
      label: "Empty",
      count: allBins.filter((b) => b.status === "empty").length,
      color: "bg-green-100",
    },
    {
      status: "partial",
      label: "Partial",
      count: allBins.filter((b) => b.status === "partial").length,
      color: "bg-yellow-100",
    },
    {
      status: "full",
      label: "Full",
      count: allBins.filter((b) => b.status === "full").length,
      color: "bg-orange-100",
    },
    {
      status: "maintenance",
      label: "Maintenance",
      count: allBins.filter((b) => b.status === "maintenance").length,
      color: "bg-blue-100",
    },
    {
      status: "damaged",
      label: "Damaged",
      count: allBins.filter((b) => b.status === "damaged").length,
      color: "bg-red-100",
    },
  ];

  const filteredBins =
    filterStatus === "all"
      ? allBins
      : allBins.filter((bin) => bin.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "empty":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "full":
        return "bg-orange-500";
      case "maintenance":
        return "bg-blue-500";
      case "damaged":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBinIcon = (type: string) => {
    switch (type) {
      case "plastic":
        return "🍼";
      case "glass":
        return "🫙";
      case "paper":
        return "📄";
      case "mixed":
        return "🗂️";
      default:
        return "🗑️";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">City Map Overview</h1>
        <p className="text-white/80">
          Monitor all waste collection bins across the municipality
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* View Toggle */}
          <div className="flex space-x-2">
            {[
              { view: "bins", label: "Bin Status", icon: "🗑️" },
              { view: "routes", label: "Collection Routes", icon: "🚛" },
              { view: "heatmap", label: "Usage Heatmap", icon: "🔥" },
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => setMapView(item.view)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  mapView === item.view
                    ? "bg-[#062f2e] text-white"
                    : "bg-gray-100 text-[#062f2e] hover:bg-[#062f2e]/10"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusTypes.map((type) => (
              <button
                key={type.status}
                onClick={() => setFilterStatus(type.status)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                  filterStatus === type.status
                    ? "bg-[#062f2e] text-white"
                    : `${type.color} text-[#062f2e] hover:bg-[#062f2e]/10`
                }`}
              >
                <span>{type.label}</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                  {type.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-96 lg:h-[600px] bg-gradient-to-br from-green-50 to-blue-50 relative flex items-center justify-center">
            {/* Placeholder for actual map */}
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
              <p className="text-[#062f2e]/70 text-lg">Interactive City Map</p>
              <p className="text-[#062f2e]/50 text-sm">
                Showing {mapView} view
              </p>
            </div>

            {/* Sample map pins based on bin status */}
            {filteredBins.slice(0, 8).map((bin, index) => (
              <div
                key={bin.id}
                className={`absolute w-4 h-4 ${getStatusColor(
                  bin.status
                )} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform`}
                style={{
                  top: `${20 + index * 10}%`,
                  left: `${15 + index * 8}%`,
                }}
                onClick={() =>
                  setSelectedBin(selectedBin === bin.id ? null : bin.id)
                }
              ></div>
            ))}

            {/* Route lines for route view */}
            {mapView === "routes" && (
              <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M50 50 Q150 100 250 80 T450 120"
                    stroke="#062f2e"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  <path
                    d="M100 150 Q200 200 300 180 T500 220"
                    stroke="#083d3c"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                </svg>
              </>
            )}
          </div>
        </div>

        {/* Bin Details Panel */}
        <div className="space-y-4">
          {selectedBin ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              {(() => {
                const bin = allBins.find((b) => b.id === selectedBin);
                return bin ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#062f2e]">
                        {bin.name}
                      </h3>
                      <div
                        className={`w-3 h-3 ${getStatusColor(
                          bin.status
                        )} rounded-full`}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#062f2e]/70">Type:</span>
                        <span className="font-medium text-[#062f2e] flex items-center space-x-1">
                          <span>{getBinIcon(bin.type)}</span>
                          <span className="capitalize">{bin.type}</span>
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#062f2e]/70">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            bin.status === "empty"
                              ? "bg-green-100 text-green-800"
                              : bin.status === "partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : bin.status === "full"
                              ? "bg-orange-100 text-orange-800"
                              : bin.status === "maintenance"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {bin.status}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#062f2e]/70">Capacity:</span>
                        <span className="font-medium text-[#062f2e]">
                          {bin.capacity}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            bin.capacity >= 90
                              ? "bg-red-500"
                              : bin.capacity >= 70
                              ? "bg-orange-500"
                              : bin.capacity >= 40
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${bin.capacity}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#062f2e]/70">Location:</span>
                        <span className="font-medium text-[#062f2e]">
                          {bin.location}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#062f2e]/70">Last Emptied:</span>
                        <span className="font-medium text-[#062f2e]">
                          {bin.lastEmptied}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button className="px-3 py-2 bg-[#062f2e] text-white rounded-lg text-sm hover:bg-[#083d3c] transition-colors">
                        Schedule Pickup
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-[#062f2e] rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        View History
                      </button>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <svg
                className="w-16 h-16 text-[#062f2e]/30 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <p className="text-[#062f2e]/70">
                Click on a bin marker to view details
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#062f2e]/70">Bins Monitored:</span>
                <span className="font-bold text-[#062f2e]">
                  {allBins.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#062f2e]/70">Need Attention:</span>
                <span className="font-bold text-red-600">
                  {
                    allBins.filter(
                      (b) => b.status === "full" || b.status === "damaged"
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#062f2e]/70">Active Routes:</span>
                <span className="font-bold text-[#062f2e]">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#062f2e]/70">Coverage Area:</span>
                <span className="font-bold text-[#062f2e]">25 km²</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
              Status Legend
            </h3>
            <div className="space-y-2">
              {statusTypes.slice(1).map((status) => (
                <div
                  key={status.status}
                  className="flex items-center space-x-3"
                >
                  <div
                    className={`w-3 h-3 ${getStatusColor(
                      status.status
                    )} rounded-full`}
                  ></div>
                  <span className="text-sm text-[#062f2e] capitalize">
                    {status.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalityMap;
