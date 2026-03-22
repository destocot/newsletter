import Link from "next/link"
import { NEWSLETTER_NAME } from "@/lib/constants"
import { SubscribeForm } from "@/components/subscribe-form"

export default function Page() {
  return (
    <main className="h-dvh">
      <header className="absolute top-0 inset-x-0 flex justify-end px-6 py-5">
        <Link
          href="/archive"
          className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Browse Past Playlists
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-6">
          ♪ &nbsp; weekly newsletter
        </p>

        <h1 className="text-5xl font-bold tracking-tight mb-4">
          {NEWSLETTER_NAME}
        </h1>

        <p className="text-muted-foreground max-w-xs mb-10 leading-relaxed font-light">
          A weekly note about music I love, what I&apos;m discovering, and what
          I&apos;m feeling.
        </p>

        <div className="w-full max-w-sm">
          <SubscribeForm />
        </div>

        <p className="text-xs text-muted-foreground mt-4 font-light">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </main>
  )
}
