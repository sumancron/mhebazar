import axios, { AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow backend to read refresh_token cookie
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// RESPONSE INTERCEPTOR – Refresh token on 401
api.interceptors.response.use(
  response => response, // If response is OK, pass it through
  async error => {
    const originalRequest = error.config;
    const refresh = Cookies.get("refresh_token");

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          { refresh },
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.access;

        if (newAccessToken) {
          // Store new token in cookie
          Cookies.set("access_token", newAccessToken, {
            expires: 1 / 24,
            secure: true,
            sameSite: "Lax",
          });

          // Update original request header and retry it
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed – redirect to login or handle accordingly
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
