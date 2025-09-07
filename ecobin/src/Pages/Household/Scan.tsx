import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

const HouseholdScan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scanResult, setScanResult] = useState<any>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory] = useState([
    {
      id: 1,
      item: "Glass Water Bottle",
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

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      });
      setStream(mediaStream);
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Unable to access camera. Please ensure you have granted camera permissions."
      );
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Close camera after capturing
      closeCamera();

      // Start loading and analysis
      setIsLoading(true);

      // Simulate analysis for 1 second, then show result
      setTimeout(() => {
        const mockResult = {
          item: "Glass Water Bottle",
          category: "Glass",
          points: 10,
          recyclable: true,
          instructions:
            "Remove cap and label, rinse clean, place in recycling bin.",
        };
        setScanResult(mockResult);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleStartScan = () => {
    setScanResult(null);
    setIsLoading(false);
    openCamera();
  };

  const handleNewScan = () => {
    setScanResult(null);
    setIsLoading(false);
    closeCamera();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#062f2e] to-[#083d3c] border-none">
        <CardContent className="p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Scan & Recycle</h1>
          <p className="text-white/80">
            Scan items to learn how to recycle them and earn points!
          </p>
        </CardContent>
      </Card>

      {/* Scanner Section */}
      <Card className="overflow-hidden">
        {!scanResult && !cameraOpen && !isLoading ? (
          <div className="p-6">
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
              <Button
                onClick={handleStartScan}
                className="bg-[#062f2e] text-white hover:bg-[#083d3c] flex items-center space-x-2 mx-auto"
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
              </Button>
            </div>
          </div>
        ) : cameraOpen ? (
          <div className="p-6">
            <div className="text-center">
              <div className="relative w-full max-w-md mx-auto mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-xl border-2 border-[#062f2e]"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Camera overlay */}
                <div className="absolute inset-4 border-2 border-white rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
              </div>

              <p className="text-[#062f2e] font-semibold mb-4">
                Position item in the frame
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={capturePhoto}
                  className="bg-[#062f2e] text-white hover:bg-[#083d3c] px-8"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Capture Photo
                </Button>
                <Button
                  onClick={closeCamera}
                  variant="outline"
                  className="border-[#062f2e] text-[#062f2e] hover:bg-[#062f2e] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="p-6">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 bg-[#062f2e]/5 rounded-xl flex items-center justify-center border-2 border-[#062f2e]/20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#062f2e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[#062f2e] font-semibold">Analyzing...</p>
                  <p className="text-[#062f2e]/70 text-sm">
                    Identifying recyclable materials
                  </p>
                </div>
              </div>
              <div className="text-[#062f2e]/70">
                <p className="font-medium mb-2">Processing your photo...</p>
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
          </div>
        ) : scanResult ? (
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
              <Button
                onClick={handleNewScan}
                className="flex-1 bg-[#062f2e] text-white hover:bg-[#083d3c]"
              >
                Scan Another Item
              </Button>
              <Button
                onClick={() => navigate("/household/map")}
                variant="outline"
                className="flex-1"
              >
                Find Nearest Bin
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Scanning Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[#062f2e]">
            Scanning Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Scan History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[#062f2e]">Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
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
                <Badge variant="secondary" className="text-green-600">
                  +{scan.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdScan;
