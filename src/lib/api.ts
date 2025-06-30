import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
export const handleApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> => {
  return response.data;
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): ApiResponse<null> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    
    return {
      success: false,
      message: axiosError.message || 'Network error occurred',
      error: axiosError.code || 'NETWORK_ERROR',
    };
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      error: 'UNKNOWN_ERROR',
    };
  }
  
  return {
    success: false,
    message: 'An unknown error occurred',
    error: 'UNKNOWN_ERROR',
  };
};

// Generic API functions
export const apiGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(url);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const apiPost = async <T, D = unknown>(
  url: string,
  data?: D
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(url, data);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const apiPut = async <T, D = unknown>(
  url: string,
  data?: D
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put<ApiResponse<T>>(url, data);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const apiDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(url);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Paginated API call
export const apiGetPaginated = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<ApiResponse<PaginatedResponse<T>>> => {
  try {
    const response = await api.get<ApiResponse<PaginatedResponse<T>>>(url, {
      params,
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// File upload
export const apiUpload = async <T>(
  url: string,
  formData: FormData
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
