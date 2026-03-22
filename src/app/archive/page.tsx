import Link from "next/link"
import { NEWSLETTER_NAME } from "@/lib/constants"
import { findAllPublicNewsletters } from "@/resources/newsletters/queries"

export default async function ArchivePage() {
  const newsletters = await findAllPublicNewsletters()

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
          ♪ &nbsp; archive
        </p>
        <h1 className="text-2xl font-bold tracking-tight">Past Newsletters</h1>
      </div>

      {newsletters.length === 0 ? (
        <p className="text-sm text-muted-foreground font-light">
          No past newsletters yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {newsletters.map((n) => (
            <li key={n.id}>
              <Link
                href={`/archive/${n.id}`}
                className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">
                  {n.title || NEWSLETTER_NAME}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(n.sentAt!).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
