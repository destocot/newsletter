import { SignOutButton } from "@/components/sign-out-button"
import { CreateNewsletterForm } from "@/components/create-newsletter-form"
import { NewsletterCard } from "@/components/newsletter-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { findAllNewsletters } from "@/resources/newsletters/queries"

export default async function DashboardPage() {
  const allNewsletters = await findAllNewsletters()

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
            ♪ &nbsp; admin
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <SignOutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">New Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateNewsletterForm />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          Past Newsletters
        </h2>

        {allNewsletters.length === 0 ? (
          <p className="text-sm text-muted-foreground font-light">
            No newsletters yet. Create your first one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {allNewsletters.map((n) => (
              <li key={n.id}>
                <NewsletterCard newsletter={n} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
