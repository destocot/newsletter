"use server"

import { db } from "@/lib/drizzle"
import { subscribers } from "@/lib/drizzle/schema"
import { SubscribeSchema } from "@/lib/validators"
import { parse } from "valibot"

export async function insertSubscriber(payload: unknown) {
  const { email } = parse(SubscribeSchema, payload)

  await db.insert(subscribers).values({ email })
}
