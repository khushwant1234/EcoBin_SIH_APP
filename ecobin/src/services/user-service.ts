import { API_BASE_URL } from "../config/constants";
import { getToken } from "./utils";

interface UserRequest {
  action: string;
}

interface UserResponse {
  success: boolean;
  user?: any;
  error?: string;
}

interface ApiUserResponse {
  data: {
    user: any;
  };
}

export const handleUserRequest = async (
  _request: UserRequest,
  _sender: any,
  sendResponse: (response: UserResponse) => void
): Promise<void> => {
  try {
    console.log("******** handleUserRequest Function ********");
    const userData = await getUser();

    console.log("Backgroundjs userData", userData);
    sendResponse({
      success: true,
      user: userData.data.user,
    });
  } catch (error) {
    console.error("Error handling user request:", error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUser = async (): Promise<ApiUserResponse> => {
  console.log("******** getUser Function ********");

  // Get token using the correct key "token"
  const token = await getToken();

  console.log("token", token);

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("response", response);

  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token using chrome.storage.local with correct key
      if (typeof window !== "undefined" && (window as any).chrome?.storage?.local) {
        const chrome = (window as any).chrome;
        await new Promise<void>((resolve, reject) => {
          chrome.storage.local.remove("token", () => {
            if (chrome.runtime?.lastError) {
              reject(new Error(chrome.runtime.lastError));
            } else {
              resolve();
            }
          });
        });
      } else {
        // Fallback to localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }
      throw new Error("Authentication token expired or invalid");
    }
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  console.log("returning response.json()");

  return await response.json();
};
