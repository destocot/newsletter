import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local" })

export default defineConfig({
  out: "migrations",
  schema: "src/lib/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
})
