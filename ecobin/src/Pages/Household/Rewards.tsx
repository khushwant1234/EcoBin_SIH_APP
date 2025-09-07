import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

const HouseholdRewards = () => {
  const navigate = useNavigate();

  const [currentPoints] = useState(1250);
  const [redeemedRewards] = useState([
    { id: 1, name: "Coffee Shop Voucher", points: 500, date: "2024-01-15" },
    { id: 2, name: "Grocery Store Discount", points: 300, date: "2024-01-10" },
  ]);

  const availableRewards = [
    {
      id: 1,
      name: "Coffee Shop Voucher",
      points: 500,
      category: "Food & Drink",
      image: "☕",
    },
    {
      id: 2,
      name: "Grocery Store 10% Off",
      points: 300,
      category: "Shopping",
      image: "🛒",
    },
    {
      id: 3,
      name: "Movie Theater Ticket",
      points: 800,
      category: "Entertainment",
      image: "🎬",
    },
    {
      id: 4,
      name: "Public Transport Credit",
      points: 200,
      category: "Transport",
      image: "🚌",
    },
    {
      id: 5,
      name: "Local Restaurant Meal",
      points: 1000,
      category: "Food & Drink",
      image: "🍽️",
    },
    {
      id: 6,
      name: "Bookstore Voucher",
      points: 400,
      category: "Education",
      image: "📚",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#062f2e]">Rewards Center</h1>
          <p className="text-gray-600 mt-2">
            Redeem your eco-points for amazing rewards!
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

      {/* Points Display */}
      <Card className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-2xl font-bold">
              {currentPoints.toLocaleString()} Points Available
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <div>
        <h2 className="text-xl font-semibold text-[#062f2e] mb-4">
          Available Rewards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRewards.map((reward) => (
            <Card
              key={reward.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{reward.image}</div>
                  <Badge
                    variant="secondary"
                    className="bg-[#062f2e]/10 text-[#062f2e] hover:bg-[#062f2e]/20"
                  >
                    {reward.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-[#062f2e] mb-2">
                  {reward.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="font-bold text-[#062f2e]">
                      {reward.points}
                    </span>
                  </div>
                  <Button
                    variant={
                      currentPoints >= reward.points ? "default" : "secondary"
                    }
                    size="sm"
                    className={
                      currentPoints >= reward.points
                        ? "bg-[#062f2e] text-white hover:bg-[#083d3c]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }
                    disabled={currentPoints < reward.points}
                  >
                    {currentPoints >= reward.points
                      ? "Redeem"
                      : "Insufficient Points"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Points Earning Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#062f2e]">
            How to Earn More Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { action: "Scan Plastic Bottle", points: "10 pts", icon: "🍼" },
              { action: "Scan Aluminum Can", points: "15 pts", icon: "🥤" },
              { action: "Scan Glass Jar", points: "20 pts", icon: "🫙" },
              { action: "Weekly Challenge", points: "50 pts", icon: "🏆" },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center p-4 bg-gray-50 border-gray-200"
              >
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-medium text-[#062f2e] mb-1">
                    {item.action}
                  </h4>
                  <p className="text-green-600 font-semibold">{item.points}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Redemption History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#062f2e]">
            Redemption History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {redeemedRewards.length > 0 ? (
            <div className="space-y-3">
              {redeemedRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-[#062f2e]">
                      {reward.name}
                    </h4>
                    <p className="text-sm text-[#062f2e]/70">
                      Redeemed on {new Date(reward.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      -{reward.points} pts
                    </p>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Redeemed
                    </Badge>
                  </div>
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <p>
                No rewards redeemed yet. Start earning and redeeming points!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdRewards;
