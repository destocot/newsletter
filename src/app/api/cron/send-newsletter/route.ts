import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { NoNewsletterEmailTemplate } from "@/components/no-newsletter-email-template"
import { EmailTemplate } from "@/components/email-template"
import { db } from "@/lib/drizzle"
import { newsletters } from "@/lib/drizzle/schema"
import { env } from "@/lib/env.server"
import { resend } from "@/lib/resend"
import { getPlaylistTracks } from "@/lib/spotify"
import { NEWSLETTER_NAME } from "@/lib/constants"
import { countSentNewsletters, findOneUnsentNewsletter } from "@/resources/newsletters/queries"
import { findAllSubscribersByStatus } from "@/resources/subscribers/queries"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const recipients = await findAllSubscribersByStatus("active")

  if (recipients.length === 0) {
    return NextResponse.json({ message: "No active subscribers." })
  }

  const newsletter = await findOneUnsentNewsletter()

  if (!newsletter) {
    await resend.batch.send(
      recipients.map((recipient) => ({
        from: "Khurram <newsletter@khurramali.site>",
        to: [recipient.email],
        subject: NEWSLETTER_NAME,
        react: NoNewsletterEmailTemplate(),
      }))
    )

    return NextResponse.json({ message: "No newsletter found. Sent fallback email." })
  }

  const [tracks, sentCount] = await Promise.all([
    getPlaylistTracks(newsletter.spotifyPlaylistUrl),
    countSentNewsletters(),
  ])
  const issueNumber = sentCount + 1
  const subject = newsletter.title
    ? `${NEWSLETTER_NAME} #${issueNumber} - ${newsletter.title}`
    : `${NEWSLETTER_NAME} #${issueNumber}`

  await resend.batch.send(
    recipients.map((recipient) => {
      const unsubscribeUrl = `${env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${recipient.unsubscribeToken}`
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
          issueNumber,
        }),
      }
    })
  )

  await db
    .update(newsletters)
    .set({ sentAt: new Date(), tracks })
    .where(eq(newsletters.id, newsletter.id))

  return NextResponse.json({ message: `Sent to ${recipients.length} subscribers.` })
}
