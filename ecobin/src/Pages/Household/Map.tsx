import { MapPin, Trash2, AlertTriangle } from "lucide-react";
import mapImage from "../../../public/snu.jpg"; // Make sure image is imported correctly

export default function DustbinMap() {
  const dustbins = [
    { location: "D Block Benches", fill: 45, distance: "120m" },
    { location: "D Block Reception", fill: 70, distance: "200m" },
    { location: "CND Atrium", fill: 30, distance: "350m" },
    { location: "Lakeside", fill: 85, distance: "500m" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-[system-ui]">
      {/* Header */}
      <header className="p-4 text-center border-b bg-white shadow-sm">
        <h1 className="text-xl font-semibold">Map</h1>
        <p className="text-sm text-gray-500">Current location: SNU Campus</p>
      </header>

      {/* Map with markers */}
      <div className="flex-1 bg-gray-200 relative flex items-center justify-center">
        <div className="w-11/12 max-w-5xl relative rounded-2xl overflow-hidden shadow-md">
          {/* Map Image */}
          <img
            src={mapImage}
            alt="Campus Map"
            className="w-full h-auto object-contain"
          />

          {/* Surya Food & Beverages Pin */}
          <MapPin
            className="absolute text-blue-600 w-6 h-6"
            style={{ bottom: "28%", left: "52%" }}
          />

          {/* Dustbin Dots (approx near roads) */}
          <div className="absolute top-20 left-1/3 w-3 h-3 bg-green-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-24 left-1/2 w-3 h-3 bg-green-600 rounded-full"></div>
        </div>
      </div>

      {/* Dustbin list */}
      <div className="p-4 space-y-3 bg-white rounded-t-3xl shadow-lg">
        <h2 className="text-lg font-medium mb-2">Nearby Dustbins</h2>
        {dustbins.map((bin, index) => (
          <div
            key={index}
            className="flex flex-col p-3 border rounded-xl hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trash2 className="text-green-600 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-800">{bin.location}</p>
                  <p className="text-xs text-gray-500">{bin.distance} away</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700">
                  {bin.fill}%
                </span>
                {bin.fill >= 80 && (
                  <AlertTriangle className="text-red-500 w-4 h-4" />
                )}
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  bin.fill < 50
                    ? "bg-green-500"
                    : bin.fill < 80
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${bin.fill}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
