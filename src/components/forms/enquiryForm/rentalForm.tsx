// components/RentalForm.tsx
"use client"

import { useState, FormEvent, JSX } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import api from "@/lib/api" // Assuming you have your configured API instance
import { useUser } from "@/context/UserContext"

interface RentalFormProps {
  productId: number
  productDetails: {
    image: string
    title: string
    description: string
    price: string | number
  }
  onClose?: () => void // Optional callback to close the dialog
}

export default function RentalForm({ productId, productDetails, onClose }: RentalFormProps): JSX.Element {
  const { user } = useUser()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!user) {
      toast.error("You must be logged in to submit a rental request.")
      setIsSubmitting(false)
      return
    }

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates for your rental.")
      setIsSubmitting(false)
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await api.post("/rentals/", {
        product: productId,
        start_date: startDate,
        end_date: endDate,
        notes,
      })

      if (response.status === 201) {
        toast.success("Rental request submitted successfully! We will get back to you soon.")
        // Clear form fields
        setStartDate("")
        setEndDate("")
        setNotes("")
        onClose?.() // Close the dialog if callback is provided
      }
    } catch (error: unknown) {
      console.error("Error submitting rental form:", error)
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = Object.values(error.response.data).flat().join(". ")
        toast.error(`Failed to submit rental request: ${errorMessages || error.response.statusText || 'Unknown error'}`)
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-auto max-h-[90vh] overflow-y-auto w-full">
      <div className="flex flex-col w-full items-start gap-6 p-6 relative bg-white">
        <div className="flex flex-col items-start gap-6 self-stretch w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 self-stretch w-full">
            <Image
              src={productDetails.image || "/no-product.png"}
              alt={productDetails.title}
              width={150}
              height={120}
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
              {productDetails.price !== "0.00" && (
                <p className="self-stretch font-semibold text-green-600 text-base tracking-[0] leading-6">
                  Price: ₹{typeof productDetails.price === "number" ? productDetails.price.toLocaleString("en-IN") : productDetails.price}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 self-stretch w-full">
            <h3 className="self-stretch font-bold text-gray-900 text-xl text-center w-full tracking-[0] leading-[normal] mt-4">
              Request a Rental
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
              />
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
                className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
              />
              <Input
                placeholder="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="h-[52px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
              />
              <Button
                type="submit"
                className="w-full h-auto items-center justify-center gap-3 p-4 bg-[#5CA131] rounded-md hover:bg-green-700 text-white font-bold text-base transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Rental Request"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}