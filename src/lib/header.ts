import { z } from "zod"

export const HeaderSchema = z.object({
    osuctoken: z.string()
});
