import { useState } from "react";

const HouseholdScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanHistory] = useState([
    {
      id: 1,
      item: "Plastic Water Bottle",
      points: 10,
      time: "2 hours ago",
      category: "Plastic",
    },
    {
      id: 2,
      item: "Aluminum Soda Can",
      points: 15,
      time: "1 day ago",
      category: "Metal",
    },
    {
      id: 3,
      item: "Glass Jam Jar",
      points: 20,
      time: "2 days ago",
      category: "Glass",
    },
    {
      id: 4,
      item: "Cardboard Box",
      points: 8,
      time: "3 days ago",
      category: "Paper",
    },
  ]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning process
    setTimeout(() => {
      const mockResult = {
        item: "Plastic Water Bottle",
        category: "Plastic",
        points: 10,
        recyclable: true,
        instructions:
          "Remove cap and label, rinse clean, place in plastic recycling bin.",
      };
      setScanResult(mockResult);
      setIsScanning(false);
    }, 3000);
  };

  const handleNewScan = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Scan & Recycle</h1>
        <p className="text-white/80">
          Scan items to learn how to recycle them and earn points!
        </p>
      </div>

      {/* Scanner Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {!scanResult ? (
          <div className="p-6">
            {!isScanning ? (
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-gray-600 mb-2">Ready to scan</p>
                    <p className="text-gray-500 text-sm">
                      Point your camera at a recyclable item
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStartScan}
                  className="bg-[#062f2e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#083d3c] transition-colors flex items-center space-x-2 mx-auto"
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                  <span>Start Scanning</span>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-6 bg-[#062f2e]/5 rounded-xl flex items-center justify-center border-2 border-[#062f2e]/20 relative">
                  <div className="absolute inset-4 border-2 border-[#062f2e] rounded-lg"></div>
                  <div className="absolute inset-4 border-2 border-[#062f2e] rounded-lg animate-ping"></div>
                  <div className="text-center z-10">
                    <div className="w-12 h-12 border-4 border-[#062f2e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#062f2e] font-semibold">Scanning...</p>
                    <p className="text-[#062f2e]/70 text-sm">Analyzing item</p>
                  </div>
                </div>
                <div className="text-[#062f2e]/70">
                  <p className="font-medium mb-2">
                    Looking for recyclable items...
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-[#062f2e] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#062f2e] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#062f2e] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#062f2e] mb-2">
                Item Identified!
              </h3>
              <p className="text-[#062f2e]/70">Here's what we found</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-[#062f2e]">
                    {scanResult.item}
                  </h4>
                  <p className="text-[#062f2e]/70">
                    {scanResult.category} waste
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xl font-bold">
                      +{scanResult.points}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">Points earned</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      scanResult.recyclable ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium text-[#062f2e]">
                    {scanResult.recyclable ? "Recyclable" : "Not Recyclable"}
                  </span>
                </div>
                <p className="text-[#062f2e]/70 text-sm leading-relaxed">
                  {scanResult.instructions}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNewScan}
                className="flex-1 bg-[#062f2e] text-white py-3 rounded-lg font-semibold hover:bg-[#083d3c] transition-colors"
              >
                Scan Another Item
              </button>
              <button className="flex-1 bg-gray-200 text-[#062f2e] py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Find Nearest Bin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scanning Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Scanning Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: "💡",
              tip: "Ensure good lighting",
              detail: "Natural light works best for accurate scanning",
            },
            {
              icon: "📱",
              tip: "Hold phone steady",
              detail: "Keep the item centered in the camera frame",
            },
            {
              icon: "🧹",
              tip: "Clean the item",
              detail: "Remove dirt and labels for better recognition",
            },
            {
              icon: "🎯",
              tip: "Focus on labels",
              detail: "Point camera at product labels and barcodes",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-2xl">{item.icon}</div>
              <div>
                <h4 className="font-medium text-[#062f2e]">{item.tip}</h4>
                <p className="text-sm text-[#062f2e]/70">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#062f2e] mb-4">
          Recent Scans
        </h3>
        <div className="space-y-3">
          {scanHistory.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#062f2e]/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#062f2e]"
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
                <div>
                  <h4 className="font-medium text-[#062f2e]">{scan.item}</h4>
                  <div className="flex items-center space-x-3 text-sm text-[#062f2e]/70">
                    <span>{scan.category}</span>
                    <span>•</span>
                    <span>{scan.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-green-600 font-semibold">
                +{scan.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseholdScan;
