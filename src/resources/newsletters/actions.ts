"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { render } from "@react-email/render"
import { parse } from "valibot"

import { EmailTemplate } from "@/components/email-template"
import { db } from "@/lib/drizzle"
import { newsletters } from "@/lib/drizzle/schema"
import { env } from "@/lib/env.server"
import { generateResponse } from "@/lib/response"
import { resend } from "@/lib/resend"
import { getPlaylistTracks } from "@/lib/spotify"
import { CreateNewsletterSchema } from "@/lib/validators"
import {
  findOneNewsletterById,
} from "@/resources/newsletters/queries"
import { findAllSubscribersByStatus } from "@/resources/subscribers/queries"

export async function createNewsletter(payload: unknown) {
  try {
    const { title, spotifyPlaylistUrl, blurb } = parse(CreateNewsletterSchema, payload)
    await db.insert(newsletters).values({ title: title || null, spotifyPlaylistUrl, blurb })
    revalidatePath("/dashboard")
    return generateResponse(true)
  } catch {
    return generateResponse(null, "Failed to create newsletter.")
  }
}

export async function archiveNewsletter(newsletterId: string) {
  await db
    .update(newsletters)
    .set({ archivedAt: new Date() })
    .where(eq(newsletters.id, newsletterId))
  revalidatePath("/dashboard")
  return generateResponse(true)
}

export async function updateBlurb(newsletterId: string, blurb: string) {
  await db
    .update(newsletters)
    .set({ blurb })
    .where(eq(newsletters.id, newsletterId))
  revalidatePath("/dashboard")
  return generateResponse(true)
}

async function _sendToSubscribers(newsletter: typeof newsletters.$inferSelect) {
  const recipients = await findAllSubscribersByStatus("active")

  if (recipients.length === 0) return generateResponse(null, "No active subscribers.")

  const tracks = await getPlaylistTracks(newsletter.spotifyPlaylistUrl)

  await resend.batch.send(
    recipients.map((recipient) => {
      const unsubscribeUrl = `${env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${recipient.unsubscribeToken}`
      const subject = newsletter.title
        ? `Songs I'm Listening To — ${newsletter.title}`
        : "Songs I'm Listening To"
      return {
        from: "Khurram <newsletter@khurramali.site>",
        to: [recipient.email],
        subject,
        react: EmailTemplate({
          title: newsletter.title,
          blurb: newsletter.blurb,
          spotifyPlaylistUrl: newsletter.spotifyPlaylistUrl,
          tracks,
          unsubscribeUrl,
        }),
      }
    }),
  )

  await db
    .update(newsletters)
    .set({ sentAt: new Date(), tracks })
    .where(eq(newsletters.id, newsletter.id))

  revalidatePath("/dashboard")
  return generateResponse(true)
}

export async function sendNewsletter(newsletterId: string) {
  const newsletter = await findOneNewsletterById(newsletterId)

  if (!newsletter) return generateResponse(null, "Newsletter not found.")
  if (newsletter.sentAt) return generateResponse(null, "Newsletter already sent.")

  return _sendToSubscribers(newsletter)
}

export async function resendNewsletter(newsletterId: string) {
  const newsletter = await findOneNewsletterById(newsletterId)

  if (!newsletter) return generateResponse(null, "Newsletter not found.")

  return _sendToSubscribers(newsletter)
}

export async function previewNewsletter(newsletterId: string) {
  const newsletter = await findOneNewsletterById(newsletterId)

  if (!newsletter) return generateResponse(null, "Newsletter not found.")

  const tracks = await getPlaylistTracks(newsletter.spotifyPlaylistUrl)

  const html = await render(
    EmailTemplate({
      title: newsletter.title,
      blurb: newsletter.blurb,
      spotifyPlaylistUrl: newsletter.spotifyPlaylistUrl,
      tracks,
      unsubscribeUrl: "#",
    })
  )

  return generateResponse(html)
}

export async function sendTestNewsletter(newsletterId: string) {
  const newsletter = await findOneNewsletterById(newsletterId)

  if (!newsletter) return generateResponse(null, "Newsletter not found.")

  const tracks = await getPlaylistTracks(newsletter.spotifyPlaylistUrl)

  await resend.emails.send({
    from: "Khurram <newsletter@khurramali.site>",
    to: [env.ADMIN_TEST_EMAIL],
    subject: newsletter.title
        ? `[TEST] Songs I'm Listening To — ${newsletter.title}`
        : "[TEST] Songs I'm Listening To",
    react: EmailTemplate({
      title: newsletter.title,
      blurb: newsletter.blurb,
      spotifyPlaylistUrl: newsletter.spotifyPlaylistUrl,
      tracks,
      unsubscribeUrl: `${env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=test`,
    }),
  })

  return generateResponse(true)
}
