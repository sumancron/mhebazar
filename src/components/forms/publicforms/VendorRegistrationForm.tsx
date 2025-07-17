"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // or your preferred notification library

interface Props {
  open: boolean;
  onClose: () => void;
}

interface VendorFormData {
  // User fields
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;

  // Vendor fields
  company_name: string;
  company_email: string;
  company_address: string;
  company_phone: string;
  brand: string;
  pcode: string;
  gst_no: string;
}

interface ApiError {
  [key: string]: string[] | string;
}

export default function VendorRegistrationDrawer({ open, onClose }: Props) {
  const [formData, setFormData] = useState<VendorFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    company_name: "",
    company_email: "",
    company_address: "",
    company_phone: "",
    brand: "",
    pcode: "",
    gst_no: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ApiError>({});

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        phone: "",
        company_name: "",
        company_email: "",
        company_address: "",
        company_phone: "",
        brand: "",
        pcode: "",
        gst_no: "",
      });
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ApiError = {};

    // Required field validation
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirm_password) newErrors.confirm_password = "Confirm password is required";
    if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!formData.company_email.trim()) newErrors.company_email = "Company email is required";
    if (!formData.company_address.trim()) newErrors.company_address = "Company address is required";
    if (!formData.company_phone.trim()) newErrors.company_phone = "Company phone is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.company_email && !emailRegex.test(formData.company_email)) {
      newErrors.company_email = "Please enter a valid company email address";
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    // Phone validation
    const phoneRegex = /^\+?1?\d{9,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (formData.company_phone && !phoneRegex.test(formData.company_phone)) {
      newErrors.company_phone = "Please enter a valid company phone number";
    }

    // GST validation (if provided)
    if (formData.gst_no) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gst_no)) {
        newErrors.gst_no = "Please enter a valid GST number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register user
      const userRegistrationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        username: formData.email, // Use email as username
        role: 3, // USER role initially
      };

      const registerResponse = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRegistrationData),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        setErrors(errorData);
        toast.error("Registration failed. Please check the form for errors.");
        return;
      }

      // Step 2: Login to get token
      const loginResponse = await fetch("/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        toast.error("Registration successful but login failed. Please login manually.");
        return;
      }

      const { access } = await loginResponse.json();

      // Step 3: Submit vendor application
      const vendorApplicationData = {
        company_name: formData.company_name,
        company_email: formData.company_email,
        company_address: formData.company_address,
        company_phone: formData.company_phone,
        brand: formData.brand || null,
        pcode: formData.pcode || null,
        gst_no: formData.gst_no || null,
      };

      const vendorResponse = await fetch("/api/vendor/apply/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}`,
        },
        body: JSON.stringify(vendorApplicationData),
      });

      if (!vendorResponse.ok) {
        const errorData = await vendorResponse.json();
        setErrors(errorData);
        toast.error("User registered but vendor application failed. Please try again from your dashboard.");
        return;
      }

      // Success
      toast.success("Vendor application submitted successfully! You will receive an email notification once it's reviewed.");
      onClose();

      // Optionally redirect to dashboard or login page
      // window.location.href = "/dashboard";

    } catch (error) {
      console.error("Vendor registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (fieldName: string) => {
    const error = errors[fieldName];
    if (!error) return null;
    const errorMessage = Array.isArray(error) ? error[0] : error;
    return <p className="text-red-500 text-sm mt-1">{errorMessage}</p>;
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-2xl text-gray-700 hover:text-black z-10"
          onClick={onClose}
          aria-label="Close"
          disabled={isSubmitting}
        >
          &times;
        </button>

        {/* Content */}
        <div className="p-8 pt-14 flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-2">Become a Vendor</h2>
          <p className="text-gray-600 mb-6">
            Fill out this form to apply for vendor status. Your application will be reviewed by our team.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Personal Information */}
            <div className="border-b pb-4 mb-2">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  {renderError("first_name")}
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter last name"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  {renderError("last_name")}
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-medium mb-1">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                />
                {renderError("email")}
              </div>

              <div className="mt-4">
                <label className="block font-medium mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                />
                {renderError("phone")}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-medium mb-1">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="************"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  {renderError("password")}
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    required
                    placeholder="************"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  {renderError("confirm_password")}
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>

              <div>
                <label className="block font-medium mb-1">
                  Company Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company name"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                />
                {renderError("company_name")}
              </div>

              <div className="mt-4">
                <label className="block font-medium mb-1">
                  Company Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company email"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                />
                {renderError("company_email")}
              </div>

              <div className="mt-4">
                <label className="block font-medium mb-1">
                  Company Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company address"
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  disabled={isSubmitting}
                />
                {renderError("company_address")}
              </div>

              <div className="mt-4">
                <label className="block font-medium mb-1">
                  Company Phone<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1234567890"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                />
                {renderError("company_phone")}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  {renderError("brand")}
                </div>

                <div>
                  <label className="block font-medium mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pcode"
                    value={formData.pcode}
                    onChange={handleInputChange}
                    placeholder="Enter pin code"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  {renderError("pcode")}
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-medium mb-1">GST Number</label>
                <input
                  type="text"
                  name="gst_no"
                  value={formData.gst_no}
                  onChange={handleInputChange}
                  placeholder="12ABCDE1234F1Z5"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                />
                {renderError("gst_no")}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded py-3 text-base transition-colors"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Vendor Application"}
            </button>

            <p className="text-sm text-gray-600 text-center mt-2">
              By submitting this form, you agree to our terms and conditions. Your application will be reviewed within 2-3 business days.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}