"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { sendNewsletter } from "@/resources/newsletters/actions"

interface SendNewsletterButtonProps {
  newsletterId: string
}

export const SendNewsletterButton = ({
  newsletterId,
}: SendNewsletterButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    startTransition(async () => {
      const res = await sendNewsletter(newsletterId)
      if ("error" in res) setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={handleClick}
      >
        Send
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
