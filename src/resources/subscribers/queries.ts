import { desc, eq, isNotNull } from "drizzle-orm"

import { db } from "@/lib/drizzle"
import { newsletters, subscribers } from "@/lib/drizzle/schema"

export async function findAllSubscribers() {
  return db.query.subscribers.findMany({
    orderBy: [desc(subscribers.createdAt)],
  })
}

export async function findAllSubscribersByStatus(
  status: "active" | "unsubscribed"
) {
  return db.query.subscribers.findMany({
    where: eq(subscribers.status, status),
  })
}

export async function findLatestSentNewsletter() {
  return db.query.newsletters.findFirst({
    where: isNotNull(newsletters.sentAt),
    orderBy: [desc(newsletters.sentAt)],
  })
}
