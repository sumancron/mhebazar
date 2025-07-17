"use client";

import React, { useEffect } from 'react';
import { FileText, ShoppingCart, Tag } from 'lucide-react';
import { StatsCardProps } from '@/types';
import AnalyticsDashboard from '@/components/admin/Graph';
import axios from 'axios';
import Cookies from 'js-cookie';

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, number, label, color = "green" }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer relative overflow-hidden">
    {/* <div className={`absolute top-0 left-0 w-20 h-20 bg-${color}-100 rounded-full opacity-50 -translate-x-4 -translate-y-4`}></div> */}
    <div className="relative z-10">
      <div className="mb-4">
        <div className={`w-10 h-10 bg-${color}-600 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mb-2">
        <h2 className={`text-3xl font-bold text-${color}-600`}>{number}</h2>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">{label}</span>
        <svg className={`w-4 h-4 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

const CompleteDashboard = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const checkUser = async () => {
      let token = Cookies.get("access_token");
      const refresh = Cookies.get("refresh_token");

      try {
        // If access token doesn't exist, try refreshing it
        if (!token) {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/token/refresh/`,
            {refresh},
            { withCredentials: true } // refresh_token read from HttpOnly cookie
          );

          token = refreshResponse.data?.access;

          if (token) {
            Cookies.set("access_token", token, {
              expires: 1 / 24, // 1 hour
              secure: true,
              sameSite: "Lax",
            });
          } else {
            throw new Error("No new access token returned");
          }
        }

        // After getting a valid access token, fetch user data
        const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = userResponse.data;
        console.log("User data fetched successfully:", userData);

        // Redirect based on role
        if (userData?.role?.id !== 1) {
          window.location.href = "/";
        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Auth or user check failed:", err);

        // If token refresh failed (e.g., 401), redirect to login
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          // Refresh token likely expired or invalid
          Cookies.remove("access_token");
          window.location.href = "/login";
        }
      }
    };

    checkUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Dashboard Content */}
      <div className="flex-1 flex">
        {/* Main Dashboard Section */}
        <div className="flex-1 p-6 min-h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard icon={FileText} number="482" label="Product Quote" color="green" />
            <StatsCard icon={ShoppingCart} number="155" label="Rent & Buy" color="green" />
            <StatsCard icon={Tag} number="0" label="Rental" color="green" />
            <StatsCard icon={FileText} number="180" label="Specification" color="green" />
            <StatsCard icon={FileText} number="44" label="Get Catalogue" color="green" />
          </div>

          {/* Charts Section - Using the previously created AnalyticsDashboard component */}
          <AnalyticsDashboard />
        </div>

        {/* Enquiry History Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Enquiry History</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b border-gray-100 pb-4">
                <h4 className="font-medium text-gray-900 mb-1">Username</h4>
                <p className="text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteDashboard;