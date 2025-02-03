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
        email_hash: z.string(),
        permission_name: z.string()
    })),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    verifyTokenOnePermision(PERMISSIONS.SUDO),
    async (c) => {
        const { email_hash, permission_name } = c.req.valid("json");

        try {
            await c.env.DB.prepare(`
                INSERT INTO userpermission(email_hash, permission_name) VALUES (?, ?)
            `)
                .bind(email_hash, permission_name)
                .run();


            return c.json({
                "message": "ok"
            }, 201);
        } catch (error) {
            return c.json({ "message": "The user already has this permission" }, 409);
        }
    }
);

app.delete(
    "/permission",
    zValidator("json", z.object({
        email_hash: z.string(),
        permission_name: z.string()
    })),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    verifyTokenOnePermision(PERMISSIONS.SUDO),
    async (c) => {
        const { email_hash, permission_name } = c.req.valid("json");

        try {
            const result = await c.env.DB.prepare(`
                DELETE FROM userpermission WHERE email_hash = ? AND permission_name = ?
            `)
                .bind(email_hash, permission_name)
                .run();

            if (result.meta.changes === 0) {
                return c.json({ "message": "Permission not found" }, 404);
            }

            return c.json({
                "message": "Permission deleted"
            }, 200);
        } catch (error) {
            return c.json({ "message": "An error occurred while deleting the permission" }, 500);
        }
    }
);


export default app