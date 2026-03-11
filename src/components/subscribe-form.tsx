"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useRef, useState, useTransition } from "react"
import { type ActionResponse } from "@/lib/response"
import { subscribe } from "@/resources/subscribers/actions"

export const SubscribeForm = () => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResponse<boolean> | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const values = Object.fromEntries(formData)
    startTransition(async () => {
      const res = await subscribe(values)
      setResult(res)
      if (!res.error) formRef.current?.reset()
    })
  }

  return (
    <div className="space-y-2">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center gap-x-2"
      >
        <div className="flex-1">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email here"
          />
        </div>

        <Button type="submit" disabled={isPending}>
          Subscribe
        </Button>
      </form>

      {result && (
        <p
          className={
            !result.error
              ? "text-sm text-green-600"
              : "text-sm text-destructive"
          }
        >
          {!result.error
            ? "You're subscribed! Thanks for signing up."
            : result.error.message}
        </p>
      )}
    </div>
  )
}
