import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/lib/drizzle/schema"
import { env } from "@/lib/env.server"

const sql = neon(env.DATABASE_URL)

const db = drizzle({ client: sql, schema })

export { db }
