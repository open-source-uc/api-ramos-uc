import { zValidator } from "@hono/zod-validator";
import { verifyTokenMiddleware } from "../../../../lib/middlewares/token";
import { PERMISSIONS, verifyTokenOnePermision } from "../../../../lib/middlewares/perms";
import { z } from "zod";
import createHono from "../../../../lib/honoBase";
import { HeaderSchema } from "../../../../lib/header";

const app = createHono()


app.post(
    "/permission",
    zValidator("json", z.object({
        sigle: z.string().min(1),
        name: z.string().min(1),
        credits: z.number().min(1).max(100),
        school: z.string(),
        area: z.string(),
        category: z.string()
    })),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    verifyTokenOnePermision(PERMISSIONS.SUDO),
    (c) => c.json({ message: "hello" }, 501))

app.delete(
    "/permission",
    zValidator("json", z.object({
        sigle: z.string().min(1),
        name: z.string().min(1),
        credits: z.number().min(1).max(100),
        school: z.string(),
        area: z.string(),
        category: z.string()
    })),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    verifyTokenOnePermision(PERMISSIONS.SUDO),
    (c) => c.json({ message: "hello" }, 501))

export default app