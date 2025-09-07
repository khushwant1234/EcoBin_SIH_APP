interface UserResponse {
  success: boolean;
  user?: any;
  error?: string;
}

export const getUser = async (): Promise<any | null> => {
  try {
    console.log("getUser function called");

    // Check if we're in a Chrome extension environment
    if (typeof window !== "undefined" && (window as any).chrome?.runtime) {
      const chrome = (window as any).chrome;
      
      const response: UserResponse = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "getUser" }, resolve);
      });

      if (!response?.success) {
        throw new Error(response?.error || "User not found");
      }
      console.log("response", response);
      return response.user;
    } else {
      console.warn("Chrome runtime not available - not in extension environment");
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
