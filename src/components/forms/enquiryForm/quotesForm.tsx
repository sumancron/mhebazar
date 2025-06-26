// components/QuoteForm.tsx
"use client"

import { useState } from "react"
import axios from "axios"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function QuoteForm({ productId }: { productId: number }) {
  const [message, setMessage] = useState("")

  const submitQuote = async () => {
    await axios.post("/api/quotes/", {
      product: productId,
      message,
    })
    alert("Quote submitted!")
    setMessage("")
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <Button onClick={submitQuote}>Request Quote</Button>
    </div>
  )
}
