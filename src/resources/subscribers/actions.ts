"use server"

import { randomBytes } from "node:crypto"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { parse } from "valibot"

import { EmailTemplate } from "@/components/email-template"
import { WelcomeEmailTemplate } from "@/components/welcome-email-template"
import { db } from "@/lib/drizzle"
import { subscribers } from "@/lib/drizzle/schema"
import { env } from "@/lib/env.server"
import { isRateLimited } from "@/lib/rate-limit"
import { generateResponse } from "@/lib/response"
import { resend } from "@/lib/resend"
import { getPlaylistTracks } from "@/lib/spotify"
import { NEWSLETTER_NAME } from "@/lib/constants"
import { SubscribeSchema, UnsubscribeSchema } from "@/lib/validators"
import { countSentNewsletters } from "@/resources/newsletters/queries"
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
    const unsubscribeUrl = `${env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`

    if (!latest) {
      await resend.emails.send({
        from: "Khurram <newsletter@khurramali.site>",
        to: [subscriber.email],
        subject: `Welcome to ${NEWSLETTER_NAME}`,
        react: WelcomeEmailTemplate(),
      })
    } else {
      const [tracks, issueNumber] = await Promise.all([
        latest.tracks ? Promise.resolve(latest.tracks) : getPlaylistTracks(latest.spotifyPlaylistUrl),
        countSentNewsletters(),
      ])

      await resend.emails.send({
        from: "Khurram <newsletter@khurramali.site>",
        to: [subscriber.email],
        subject: latest.title
          ? `${NEWSLETTER_NAME} #${issueNumber} - ${latest.title}`
          : `${NEWSLETTER_NAME} #${issueNumber}`,
        react: EmailTemplate({
          title: latest.title,
          blurb: latest.blurb,
          spotifyPlaylistUrl: latest.spotifyPlaylistUrl,
          tracks,
          unsubscribeUrl,
          issueNumber,
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
