import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";

const HouseholdReports = () => {
  const navigate = useNavigate();

  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [reportData] = useState({
    totalItems: 156,
    totalPoints: 1250,
    co2Saved: 24.5,
    recyclingRate: 78,
    weeklyData: [
      { week: "Week 1", items: 38, points: 312 },
      { week: "Week 2", items: 42, points: 328 },
      { week: "Week 3", items: 35, points: 285 },
      { week: "Week 4", items: 41, points: 325 },
    ],
    categoryBreakdown: [
      { category: "Plastic", items: 67, percentage: 43 },
      { category: "Paper", items: 41, percentage: 26 },
      { category: "Glass", items: 32, percentage: 21 },
      { category: "Metal", items: 16, percentage: 10 },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#062f2e]">
            Recycling Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Track your environmental impact and recycling progress
          </p>
        </div>
        <Button
          onClick={() => navigate("/household/dashboard")}
          variant="outline"
          className="bg-gray-100 text-[#062f2e] hover:bg-gray-200"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            {["week", "month", "year"].map((period) => (
              <Button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? "default" : "outline"}
                className={`capitalize ${
                  selectedPeriod === period
                    ? "bg-[#062f2e] text-white hover:bg-[#083d3c]"
                    : "bg-gray-100 text-[#062f2e] hover:bg-gray-200"
                }`}
              >
                {period}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-[#062f2e]">
                  {reportData.totalItems}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                <p className="text-sm font-medium text-gray-600">
                  Points Earned
                </p>
                <p className="text-2xl font-bold text-[#062f2e]">
                  {reportData.totalPoints}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-[#062f2e]">
                  {reportData.co2Saved} kg
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
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
                <p className="text-sm font-medium text-gray-600">
                  Recycling Rate
                </p>
                <p className="text-2xl font-bold text-[#062f2e]">
                  {reportData.recyclingRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
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
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#062f2e]">
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.weeklyData.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {week.week}
                  </span>
                  <span className="text-sm text-gray-500">
                    {week.items} items • {week.points} pts
                  </span>
                </div>
                <Progress
                  value={
                    (week.items /
                      Math.max(...reportData.weeklyData.map((w) => w.items))) *
                    100
                  }
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#062f2e]">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.categoryBreakdown.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {category.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {category.items} items ({category.percentage}%)
                  </span>
                </div>
                <Progress
                  value={category.percentage}
                  className={`h-2 ${
                    index === 0
                      ? "[&>div]:bg-blue-500"
                      : index === 1
                      ? "[&>div]:bg-yellow-500"
                      : index === 2
                      ? "[&>div]:bg-green-500"
                      : "[&>div]:bg-orange-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#062f2e]">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/household/scan")}
              variant="ghost"
              className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 text-center h-auto flex-col space-y-2"
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
                Scan New Item
              </span>
            </Button>
            <Button
              onClick={() => navigate("/household/rewards")}
              variant="ghost"
              className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 text-center h-auto flex-col space-y-2"
            >
              <svg
                className="w-8 h-8 text-[#062f2e]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-[#062f2e]">
                View Rewards
              </span>
            </Button>
            <Button
              onClick={() => navigate("/household/map")}
              variant="ghost"
              className="p-4 bg-[#062f2e]/5 hover:bg-[#062f2e]/10 text-center h-auto flex-col space-y-2"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdReports;
