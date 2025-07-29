import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { JSX, useState, FormEvent } from "react";
import Image from 'next/image';
import api from "@/lib/api"; // Your existing API instance
import { toast } from "sonner"; // For notifications
import { useUser } from "@/context/UserContext"; // Assuming you have a UserContext
import axios from "axios";

interface QuoteFormProps {
  productId: number;
  productDetails: {
    image: string;
    title: string;
    description: string;
    price: string | number;
  };
  onClose?: () => void; // Optional callback to close the dialog
}

const QuoteForm = ({ productId, productDetails, onClose }: QuoteFormProps): JSX.Element => {
  const { user } = useUser(); // Get user from context
  const [fullName, setFullName] = useState(user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error("You must be logged in to submit a quote request.");
      setIsSubmitting(false);
      return;
    }

    if (!message.trim()) {
      toast.error("Please provide a message for your quote request.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/quotes/", {
        product: productId,
        message: message,
        // The backend `QuoteSerializer` does not directly accept full_name, company_name, email, phone.
        // These fields are typically handled by the user's profile or implicitly through authentication.
        // If you need to store these per quote, you'd extend your Django Quote model and serializer.
        // For now, we collect them on the frontend but only send what the backend expects.
      });

      if (response.status === 201) {
        toast.success("Quote request submitted successfully! We will get back to you soon.");
        // Clear form fields
        setFullName("");
        setCompanyName("");
        setEmail("");
        setPhone("");
        setMessage("");
        onClose?.(); // Close the dialog if callback is provided
      }
    } catch (error: unknown) {
      console.error("Error submitting quote form:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = Object.values(error.response.data).flat().join(". ");
        toast.error(`Failed to submit quote: ${errorMessages || error.response.statusText || 'Unknown error'}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-auto max-h-[90vh] overflow-y-auto w-full">
      <Card className="border-none shadow-none">
        <CardContent className="flex flex-col w-full items-start gap-6 p-6 relative bg-white">
          <div className="flex flex-col items-start gap-6 self-stretch w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 self-stretch w-full">
              <img
                src={productDetails.image || "/no-product.png"}
                alt={productDetails.title}
                width={150} // Adjusted width for better display in form
                height={120} // Adjusted height
                className="relative object-cover rounded-md"
              />
              <div className="flex-col items-start gap-2 pt-0 sm:pt-4 pb-0 px-0 flex-1 flex">
                <h2 className="self-stretch font-bold text-gray-900 text-xl sm:text-2xl tracking-[0] leading-[normal]">
                  {productDetails.title}
                </h2>
                {productDetails.description && (
                  <p className="self-stretch font-normal text-gray-700 text-sm sm:text-base tracking-[0] leading-6">
                    {productDetails.description}
                  </p>
                )}
                {productDetails.price !== "0.00" && ( // Only show price if not 0.00
                  <p className="self-stretch font-semibold text-green-600 text-base tracking-[0] leading-6">
                    Price: ₹{typeof productDetails.price === "number" ? productDetails.price.toLocaleString("en-IN") : productDetails.price}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 self-stretch w-full">
              <h3 className="self-stretch font-bold text-gray-900 text-xl text-center w-full tracking-[0] leading-[normal] mt-4">
                Get a Quote
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <Input
                    className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
                    placeholder="Company name (Optional)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <Input
                    className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
                    placeholder="Phone (Optional)"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Textarea
                  className="min-h-[100px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
                  placeholder="Your Message (e.g., specific requirements, quantity, desired timeline)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  className="w-full h-auto items-center justify-center gap-3 p-4 bg-green-600 rounded-md hover:bg-green-700 text-white font-bold text-base transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;
