import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Skeleton } from "@/Components/ui/skeleton";
import { API_BASE_URL } from "../../config/constants";
import { GetApiCall } from "../../utils/apiCall";

interface BinData {
  fillPercentages: {
    organic: number;
    hazardous: number;
    recyclable: number;
  };
  fillStatus: {
    organic: string;
    hazardous: string;
    recyclable: string;
  };
  totalWeight: {
    organic: number;
    hazardous: number;
    recyclable: number;
  };
  remainingCapacity: {
    organic: number;
    hazardous: number;
    recyclable: number;
  };
  itemCounts: {
    organic: number;
    hazardous: number;
    recyclable: number;
  };
  binCapacity: number;
  totalAnalyzedItems: number;
  calculatedAt: string;
}

interface LatestItem {
  id: string;
  name: string;
  weight: number;
  category: "organic" | "recyclable" | "hazardous";
  addedAt: string;
  timeAgo: string;
}

const HouseholdDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    pointsEarned: 1250,
    recyclingRate: 78,
    nextPickup: "Tomorrow, 9:00 AM",
  });

  const [binData, setBinData] = useState<BinData | null>(null);
  const [latestItems, setLatestItems] = useState<LatestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bin fill levels from API
  const getBinFillLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(
        "Fetching bin fill levels from:",
        `${API_BASE_URL}/api/bin/fill-levels`
      );

      const data = await GetApiCall(`${API_BASE_URL}/api/bin/fill-levels`);
      console.log("Response data:", data);

      if (data.success) {
        setBinData(data.data);
      } else {
        setError("Failed to fetch bin data");
      }
    } catch (error) {
      console.error("Error fetching fill levels:", error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest scanned items from API
  const getLatestItems = async () => {
    try {
      setItemsLoading(true);
      console.log(
        "Fetching latest items from:",
        `${API_BASE_URL}/bin/items/latest`
      );

      const data = await GetApiCall(`${API_BASE_URL}/bin/items/latest`);
      console.log("Latest items data:", data);

      if (data.success) {
        setLatestItems(data.data.items);
      } else {
        console.error("Failed to fetch latest items:", data.message);
        // Keep existing empty array if API fails
      }
    } catch (error) {
      console.error("Error fetching latest items:", error);
      // Keep existing empty array if API fails
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    console.log("API_BASE_URL:", API_BASE_URL);
    console.log(
      "Environment VITE_BACKEND_URL:",
      import.meta.env.VITE_BACKEND_URL
    );

    // Test API connectivity first
    const testApiConnectivity = async () => {
      try {
        const healthResponse = await fetch(
          `${API_BASE_URL.replace("/api", "")}/health`
        );
        console.log("Health check response:", healthResponse.status);
        if (healthResponse.ok) {
          console.log("API is reachable");
        } else {
          console.log("API health check failed");
        }
      } catch (error) {
        console.error("API connectivity test failed:", error);
      }
    };

    testApiConnectivity();
    getBinFillLevels();
    getLatestItems();
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      getBinFillLevels();
      getLatestItems();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getBinIcon = (type: string) => {
    switch (type) {
      case "organic":
        return "🍂";
      case "hazardous":
        return "☠️";
      case "recyclable":
        return "♻️";
      default:
        return "🗑️";
    }
  };

  // Calculate points based on category and weight
  const calculatePoints = (category: string, weight: number) => {
    const basePoints = {
      organic: 5,
      recyclable: 10,
      hazardous: 20,
    };
    const categoryPoints = basePoints[category as keyof typeof basePoints] || 5;
    // Calculate points based on weight (minimum 1 point)
    return Math.max(Math.round((weight / 50) * categoryPoints), 1);
  };

  const getTotalWaste = () => {
    if (!binData) return 0;
    return (
      Object.values(binData.totalWeight).reduce(
        (sum, weight) => sum + weight,
        0
      ) / 1000
    ); // Convert to kg
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] border-none">
        <CardContent className="p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-white/80">Here's your waste management overview</p>
          {binData && (
            <p className="text-white/60 text-sm mt-2">
              Last updated: {new Date(binData.calculatedAt).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              onClick={getBinFillLevels}
              variant="outline"
              size="sm"
              className="ml-4 bg-red-600 text-white border-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#062f2e]/70 text-sm font-medium">
                  Total Waste
                </p>
                <p className="text-2xl font-bold text-[#062f2e]">
                  {loading ? "..." : `${getTotalWaste().toFixed(1)} kg`}
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#062f2e]/70 text-sm font-medium">
                  Total Items
                </p>
                <p className="text-2xl font-bold text-[#062f2e]">
                  {loading ? "..." : binData?.totalAnalyzedItems || "0"}
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Bin Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[#062f2e]">
            Live Bin Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={getBinFillLevels}
            disabled={loading}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#062f2e]/10 text-[#062f2e] hover:bg-[#062f2e]/20"
            }`}
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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
            <span>Refresh</span>
          </button>
        </CardContent>

        {loading && !binData ? (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </CardContent>
        ) : binData ? (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["organic", "hazardous", "recyclable"] as const).map(
                (binType) => {
                  const fillPercentage = binData.fillPercentages[binType];
                  const status = binData.fillStatus[binType];
                  const weight = binData.totalWeight[binType];
                  const itemCount = binData.itemCounts[binType];
                  const remaining = binData.remainingCapacity[binType];

                  return (
                    <Card key={binType} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">
                              {getBinIcon(binType)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#062f2e] capitalize">
                                {binType} Waste
                              </h4>
                              <Badge
                                variant={
                                  status === "empty" || status === "low"
                                    ? "default"
                                    : status === "medium"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="capitalize"
                              >
                                {status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#062f2e]">
                              {fillPercentage}%
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <Progress value={fillPercentage} className="mb-4" />

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-[#062f2e]">
                              {weight}g
                            </div>
                            <div className="text-[#062f2e]/70">
                              Current Weight
                            </div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-semibold text-[#062f2e]">
                              {itemCount}
                            </div>
                            <div className="text-[#062f2e]/70">Items</div>
                          </div>
                        </div>

                        <div className="mt-3 text-center text-xs text-[#062f2e]/60">
                          {remaining}g remaining capacity
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="text-center py-8 text-[#062f2e]/70">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-[#062f2e]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>No bin data available</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#062f2e]">
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            ) : latestItems.length > 0 ? (
              <div className="space-y-3">
                {latestItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[#062f2e]">{item.name}</p>
                      <p className="text-sm text-[#062f2e]/70">
                        {item.timeAgo} • {item.weight}g • {item.category}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      +{calculatePoints(item.category, item.weight)} pts
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#062f2e]/70">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-[#062f2e]/30"
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
                <p>No recent scans found</p>
                <p className="text-sm mt-1">
                  Start scanning items to see them here!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#062f2e]">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate("/household/scan")}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 border-[#062f2e]/20 hover:bg-[#062f2e]/5"
              >
                <svg
                  className="w-8 h-8 text-[#062f2e]"
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
              </Button>
              <Button
                onClick={() => navigate("/household/map")}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 border-[#062f2e]/20 hover:bg-[#062f2e]/5"
              >
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
              </Button>
              <Button
                onClick={() => navigate("/household/rewards")}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 border-[#062f2e]/20 hover:bg-[#062f2e]/5"
              >
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
              </Button>
              <Button
                onClick={() => navigate("/household/reports")}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 border-[#062f2e]/20 hover:bg-[#062f2e]/5"
              >
                <svg
                  className="w-8 h-8 text-[#062f2e]"
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
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Pickup Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
              <div>
                <h3 className="text-lg font-semibold text-[#062f2e]">
                  Next Pickup
                </h3>
                <p className="text-[#062f2e]/70">{stats.nextPickup}</p>
              </div>
            </div>
            <Button className="bg-[#062f2e] text-white hover:bg-[#083d3c]">
              Set Reminder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdDashboard;
