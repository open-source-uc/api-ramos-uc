import { zValidator } from "@hono/zod-validator";
import createHono from "../../../lib/honoBase";
import { z } from "zod";
import { verify } from "hono/jwt";
import { env } from "hono/adapter";
import { HeaderSchema } from "../../../lib/header";
const app = createHono()

app.post(
    "/",
    zValidator("json", z.object({
        course_sigle: z.string(),
        nickname: z.string(),
        year: z.number().min(2013),
        section_number: z.number().min(1).max(100),
        liked: z.boolean(),
        comment: z.string().min(10).max(500),
        estimated_credits: z.number().min(1),
    })),
    zValidator("header", HeaderSchema),
    async (c) => {
        try {
            const { osuctoken } = c.req.valid("header")
            const { nickname, year, course_sigle, section_number, liked, comment, estimated_credits } = c.req.valid("json")

            const user = await c.env.DB.prepare(`SELECT secret_key FROM useraccount WHERE nickname = ?`).bind(nickname).first()

            if (!user)
                return c.json("Usuario no encontrado", 404)

            const { SECRET_GLOBAL_KEY } = env(c);
            const payload = await verify(osuctoken, user.secret_key + SECRET_GLOBAL_KEY, "HS256")

            await c.env.DB.prepare(`
                INSERT INTO review(
                course_sigle, 
                email_hash, 
                year,
                section_number, 
                liked,
                comment, 
                estimated_credits,
                status
                ) VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
                )
                `)
                .bind(
                    course_sigle,
                    payload?.hashed_email,
                    year,
                    section_number,
                    liked,
                    comment,
                    estimated_credits,
                    'visible'
                )
                .run()

            return c.json({
                message: "Create review"
            }, 201)
        } catch (error) {
            return c.json({
                message: error?.toString(),
                error: true
            }, 500)
        }
    })

app.put(
    "/",
    zValidator(
        "json",
        z.object({
            course_sigle: z.string(),
            nickname: z.string(),
            year: z.number().min(2013),
            section_number: z.number().min(1).max(100),
            liked: z.boolean(),
            comment: z.string().min(10).max(500),
            estimated_credits: z.number().min(1),
        })
    ),
    zValidator(
        "header",
        HeaderSchema
    ),
    async (c) => {
        try {
            const { osuctoken } = c.req.valid("header");
            const { course_sigle, nickname, year, section_number, liked, comment, estimated_credits } =
                c.req.valid("json");

            const user = await c.env.DB.prepare(
                `SELECT secret_key FROM useraccount WHERE nickname = ?`
            )
                .bind(nickname)
                .first();

            if (!user) return c.json("Usuario no encontrado", 404);

            const { SECRET_GLOBAL_KEY } = env(c);
            const payload = await verify(osuctoken, user.secret_key + SECRET_GLOBAL_KEY, "HS256");

            const result = await c.env.DB.prepare(
                `
              UPDATE review
              SET
                  year = ?,
                  section_number = ?,
                  liked = ?,
                  comment = ?,
                  estimated_credits = ?
              WHERE email_hash = ? AND course_sigle = ?
              `
            )
                .bind(
                    year,
                    section_number,
                    liked,
                    comment,
                    estimated_credits,
                    payload?.hashed_email,
                    course_sigle
                )
                .run();

            if (result.meta.changes === 0) {
                return c.json({ message: "Reseña no encontrada" }, 404);
            }

            return c.json({ message: "Reseña actualizada correctamente" }, 200);
        } catch (error) {
            return c.json(
                {
                    message: error?.toString(),
                    error: true,
                },
                500
            );
        }
    }
);

app.delete(
    "/",
    zValidator(
        "json",
        z.object({
            course_sigle: z.string(),
            nickname: z.string(),
        })
    ),
    zValidator(
        "header",
        HeaderSchema
    ),
    async (c) => {
        try {
            const { osuctoken } = c.req.valid("header");
            const { course_sigle, nickname } = c.req.valid("json");

            const user = await c.env.DB.prepare(
                `SELECT secret_key FROM useraccount WHERE nickname = ?`
            )
                .bind(nickname)
                .first();

            if (!user) return c.json("Usuario no encontrado", 404);

            const { SECRET_GLOBAL_KEY } = env(c);
            const payload = await verify(osuctoken, user.secret_key + SECRET_GLOBAL_KEY, "HS256");

            const result = await c.env.DB.prepare(
                `
          DELETE FROM review
          WHERE email_hash = ? AND course_sigle = ?
          `
            )
                .bind(payload?.hashed_email, course_sigle)
                .run();

            if (result.meta.changes === 0) {
                return c.json({ message: "Reseña no encontrada" }, 404);
            }

            return c.json({ message: "Reseña eliminada correctamente" }, 200);
        } catch (error) {
            return c.json(
                {
                    message: error?.toString(),
                    error: true,
                },
                500
            );
        }
    }
);



export default app