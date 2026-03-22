import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { AvatarGenerateClient } from "./client"

export default async function AvatarGeneratePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return <AvatarGenerateClient />
}
