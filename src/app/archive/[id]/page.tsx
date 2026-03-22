import { notFound } from "next/navigation"
import Link from "next/link"
import { NEWSLETTER_NAME } from "@/lib/constants"
import { findOneNewsletterById } from "@/resources/newsletters/queries"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ArchiveNewsletterPage({ params }: Props) {
  const { id } = await params
  const newsletter = await findOneNewsletterById(id)

  if (!newsletter || !newsletter.sentAt || newsletter.archivedAt) notFound()

  const tracks = newsletter.tracks ?? []

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
          ♪ &nbsp; archive
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {newsletter.title || NEWSLETTER_NAME}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date(newsletter.sentAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {tracks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            This Week&apos;s Playlist
          </h2>
          <ul className="space-y-2">
            {tracks.map((track, i) => (
              <li key={track.url} className="flex items-baseline gap-3 text-sm">
                <span className="text-muted-foreground w-5 shrink-0 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {track.name}
                  </a>
                  <span className="text-muted-foreground">
                    {" "}— {track.artists.join(", ")}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href={newsletter.spotifyPlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-medium underline underline-offset-4"
          >
            Open full playlist on Spotify →
          </a>
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">No tracks saved for this newsletter.</p>
      )}

      <Link
        href="/archive"
        className="inline-block text-xs text-muted-foreground hover:underline"
      >
        ← Back to archive
      </Link>
    </main>
  )
}
