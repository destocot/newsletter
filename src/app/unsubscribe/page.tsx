import { unsubscribe } from "@/resources/subscribers/actions"

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <main className="h-dvh">
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            ♪ &nbsp; songs I&apos;m listening to
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Invalid link
          </h1>
          <p className="text-muted-foreground font-light max-w-xs leading-relaxed">
            This unsubscribe link is missing a token. Please use the link from
            your email.
          </p>
        </div>
      </main>
    )
  }

  try {
    await unsubscribe({ token })
    return (
      <main className="h-dvh">
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            ♪ &nbsp; songs I&apos;m listening to
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            You&apos;re unsubscribed
          </h1>
          <p className="text-muted-foreground font-light max-w-xs leading-relaxed">
            You&apos;ve been removed from the list and won&apos;t receive any
            more emails.
          </p>
        </div>
      </main>
    )
  } catch {
    return (
      <main className="h-dvh">
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            ♪ &nbsp; songs I&apos;m listening to
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground font-light max-w-xs leading-relaxed">
            We couldn&apos;t process your request. Please try again or reply to
            any newsletter email.
          </p>
        </div>
      </main>
    )
  }
}
