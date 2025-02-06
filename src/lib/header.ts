import { z } from "@hono/zod-openapi"

export const HeaderSchema = z.object({
    osuctoken: z.string()
}).openapi("TokenHeader");
