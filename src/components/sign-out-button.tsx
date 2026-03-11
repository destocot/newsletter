"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"

export const SignOutButton = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await signOut()
      router.push("/login")
    })
  }

  return (
    <Button variant="outline" disabled={isPending} onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}
