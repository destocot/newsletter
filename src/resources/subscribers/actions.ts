"use server"

import { randomBytes } from "node:crypto"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { parse } from "valibot"

import { EmailTemplate } from "@/components/email-template"
import { db } from "@/lib/drizzle"
import { subscribers } from "@/lib/drizzle/schema"
import { env } from "@/lib/env.server"
import { isRateLimited } from "@/lib/rate-limit"
import { generateResponse } from "@/lib/response"
import { resend } from "@/lib/resend"
import { getPlaylistTracks } from "@/lib/spotify"
import { SubscribeSchema, UnsubscribeSchema } from "@/lib/validators"
import { findLatestSentNewsletter } from "@/resources/subscribers/queries"

export async function subscribe(payload: unknown) {
  try {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

    if (isRateLimited(ip)) {
      return generateResponse(null, "Too many requests. Please try again later.")
    }

    const { email } = parse(SubscribeSchema, payload)
    const token = randomBytes(16).toString("hex")

    const result = await db
      .insert(subscribers)
      .values({ email, unsubscribeToken: token })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: { status: "active", updatedAt: new Date() },
      })
      .returning()

    const subscriber = result[0]

    const latest = await findLatestSentNewsletter()

    if (latest) {
      const tracks = await getPlaylistTracks(latest.spotifyPlaylistUrl)
      const unsubscribeUrl = `${env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`

      await resend.emails.send({
        from: "Khurram <newsletter@khurramali.site>",
        to: [subscriber.email],
        subject: latest.title
          ? `Songs I'm Listening To — ${latest.title}`
          : "Songs I'm Listening To",
        react: EmailTemplate({
          title: latest.title,
          blurb: latest.blurb,
          spotifyPlaylistUrl: latest.spotifyPlaylistUrl,
          tracks,
          unsubscribeUrl,
        }),
      })
    }

    return generateResponse(true)
  } catch {
    return generateResponse(null, "Something went wrong. Please try again.")
  }
}

export async function unsubscribe(payload: unknown) {
  const { token } = parse(UnsubscribeSchema, payload)

  await db
    .update(subscribers)
    .set({ status: "unsubscribed" })
    .where(eq(subscribers.unsubscribeToken, token))

  return generateResponse(true)
}
