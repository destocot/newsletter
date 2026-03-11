import { and, desc, eq, isNull, isNotNull, lt } from "drizzle-orm"

import { db } from "@/lib/drizzle"
import { newsletters } from "@/lib/drizzle/schema"

export async function findAllNewsletters() {
  return db.query.newsletters.findMany({
    where: isNull(newsletters.archivedAt),
    orderBy: [desc(newsletters.createdAt)],
  })
}

export async function findOneNewsletterById(id: string) {
  return db.query.newsletters.findFirst({
    where: eq(newsletters.id, id),
  })
}

export async function findOneUnsentNewsletter() {
  return db.query.newsletters.findFirst({
    where: and(isNull(newsletters.sentAt), isNull(newsletters.archivedAt)),
    orderBy: [desc(newsletters.createdAt)],
  })
}

export async function findAllPublicNewsletters() {
  // Find the most recently sent newsletter so we can exclude it
  const latest = await db.query.newsletters.findFirst({
    where: and(isNotNull(newsletters.sentAt), isNull(newsletters.archivedAt)),
    orderBy: [desc(newsletters.sentAt)],
  })

  return db.query.newsletters.findMany({
    where: and(
      isNotNull(newsletters.sentAt),
      isNull(newsletters.archivedAt),
      latest ? lt(newsletters.sentAt, latest.sentAt!) : undefined
    ),
    orderBy: [desc(newsletters.sentAt)],
  })
}
