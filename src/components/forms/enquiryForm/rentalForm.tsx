// components/RentalForm.tsx
"use client"

import { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RentalForm({ productId }: { productId: number }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async () => {
    await axios.post("/rentals/", {
      product: productId,
      start_date: startDate,
      end_date: endDate,
      notes,
    })
    alert("Rental request sent.")
  }

  return (
    <div className="space-y-3">
      <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
      <Button onClick={handleSubmit}>Submit Rental Request</Button>
    </div>
  )
}
