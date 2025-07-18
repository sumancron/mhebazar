"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { FileText, ShoppingCart, Tag, Check, X, Building, LucideIcon } from 'lucide-react';
import AnalyticsDashboard from '@/components/admin/Graph';
import api from '@/lib/api'; // Use the configured axios instance
import Cookies from 'js-cookie';
import { toast } from "sonner"; // 👈 Import sonner toast

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// --- Type Definitions ---
export interface StatsCardProps {
  icon: LucideIcon;
  number: string;
  label: string;
  color?: string;
}

export interface VendorApplication {
  username: string;
  is_approved: boolean;
  id: number;
  company_name: string;
  company_email: string;
  company_address: string;
  company_phone: string;
  brand: string;
  gst_no: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
  };
}

// --- Helper Components ---
const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, number, label, color = "green" }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer relative overflow-hidden">
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

// --- Main Dashboard Component ---
const CompleteDashboard = () => {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<VendorApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // --- Initial Auth Check ---
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userResponse = await api.get('/users/me/');
        if (userResponse.data?.role?.id !== 1) { // Assuming admin role ID is 1
          window.location.href = "/";
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Auth check failed:", err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          Cookies.remove("access_token");
          window.location.href = "/login";
        }
      }
    };
    checkUser();
  }, []);

  // --- Fetch Vendor Applications ---
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/vendors/');
      console.log(response)
      const pending = response.data.results.filter(
        (app: VendorApplication) => app.is_approved == false
      );
      setApplications(pending);
    } catch (error) {
      console.error("Failed to fetch vendor applications:", error);
      toast.error("Error", {
        description: "Could not fetch vendor applications.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // --- Handler Functions for Approve/Reject ---
  const handleApprove = async (vendorId: number) => {
    try {
      await api.post(`/vendors/${vendorId}/approve/`, { action: 'approve' });
      toast.success("Success", {
        description: "Vendor application has been approved.",
      });
      fetchApplications();
    } catch (error) {
      console.error("Failed to approve vendor:", error);
      toast.error("Approval Failed", {
        description: "An error occurred while approving the application.",
      });
    }
  };

  const handleOpenRejectModal = (vendor: VendorApplication) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedVendor || !rejectionReason.trim()) {
      toast.error("Validation Error", {
        description: "Rejection reason is required.",
      });
      return;
    }

    try {
      await api.post(`/vendors/${selectedVendor.id}/approve/`, {
        action: 'reject',
        reason: rejectionReason,
      });
      toast.success("Success", {
        description: "Vendor application has been rejected and deleted.",
      });
      setIsModalOpen(false);
      setSelectedVendor(null);
      setRejectionReason("");
      fetchApplications();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to reject vendor:", error);
      const errorMessage = error.response?.data?.error || "An error occurred while rejecting the application.";
      toast.error("Rejection Failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Main Dashboard Section */}
        <div className="flex-1 p-6 min-h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard icon={FileText} number="482" label="Product Quote" color="green" />
            <StatsCard icon={ShoppingCart} number="155" label="Rent & Buy" color="green" />
            <StatsCard icon={Tag} number="0" label="Rental" color="green" />
            <StatsCard icon={FileText} number="180" label="Specification" color="green" />
            <StatsCard icon={FileText} number="44" label="Get Catalogue" color="green" />
          </div>
          <AnalyticsDashboard />
        </div>

        {/* Vendor Applications Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Vendor Applications</h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="text-gray-500">Loading applications...</p>
            ) : applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center mb-2">
                    <Building className="w-5 h-5 mr-3 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">{app.company_name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 ml-8">
                    Applied by: {app.username}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleOpenRejectModal(app)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(app.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-10">No pending applications.</p>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Vendor Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting the application for <span className="font-semibold">{selectedVendor?.company_name}</span>. This reason will be sent to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your reason here..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>Submit Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompleteDashboard;