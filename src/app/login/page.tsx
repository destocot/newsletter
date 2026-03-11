"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    startTransition(async () => {
      const { error } = await signIn.email({ email, password })
      if (error) {
        setError(error.message ?? "Invalid credentials.")
      } else {
        router.push("/dashboard")
      }
    })
  }

  return (
    <main className="h-dvh">
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
              ♪ &nbsp; admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
