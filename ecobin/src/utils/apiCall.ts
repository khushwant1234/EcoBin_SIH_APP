import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { getItem, removeItem } from "./storage";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface ErrorResponse {
  message: string;
}

const handleApiError = (error: AxiosError<ErrorResponse>) => {
  if (error.response?.data?.message) {
    if (
      error.response.data.message === "Unauthorized Access" ||
      error.response.data.message === "invalid token" ||
      error.response.data.message === "Invalid JWT Token"
    ) {
      removeItem("token");
      toast.error("Please Login Again");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      toast.error(error.response.data.message);
    }
  } else {
    toast.error("Something went wrong, Please try again later.");
  }
};

const getAuthHeaders = async (): Promise<{ Authorization?: string }> => {
  try {
    const token = await getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error("Error getting auth headers:", error);
    return {};
  }
};

export const GetApiCall = async (url: string): Promise<ApiResponse> => {
  try {
    const { data } = await axios.get(url, { headers: await getAuthHeaders() });
    return data;
  } catch (error) {
    handleApiError(error as AxiosError<ErrorResponse>);
    return { success: false };
  }
};

export const PostApiCall = async (url: string, payload?: any): Promise<ApiResponse> => {
  try {
    const token = await getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const { data } = await axios.post(url, payload, config);
    return data;
  } catch (error) {
    handleApiError(error as AxiosError<ErrorResponse>);
    return { success: false };
  }
};

export const PutApiCall = async (url: string, formData: any): Promise<ApiResponse> => {
  try {
    const { data } = await axios.put(url, formData, {
      headers: await getAuthHeaders(),
    });
    return data;
  } catch (err) {
    handleApiError(err as AxiosError<ErrorResponse>);
    return { success: false };
  }
};

export const DeleteApiCall = async (url: string): Promise<ApiResponse> => {
  try {
    const { data } = await axios.delete(url, {
      headers: await getAuthHeaders(),
    });
    return data;
  } catch (err) {
    handleApiError(err as AxiosError<ErrorResponse>);
    return { success: false };
  }
};
