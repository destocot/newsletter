import { sql } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

const base = {
  id: uuid("id")
    .default(sql`pg_catalog.gen_random_uuid()`)
    .primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}

export const subscribers = pgTable("subscribers", {
  ...base,
  email: text("email").notNull().unique(),
})
