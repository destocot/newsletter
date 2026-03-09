import * as v from "valibot"

const EmailSchema = v.pipe(v.string(), v.nonEmpty(), v.email())

export const SubscribeSchema = v.object({
  email: EmailSchema,
})
