import { zValidator } from "@hono/zod-validator";
import createHono from "../../../lib/honoBase";
import { z } from "zod";
import { HeaderSchema } from "../../../lib/header";
import { TokenPayload, verifyTokenMiddleware } from "../../../lib/middlewares/token";
const app = createHono()

app.post(
    "/",
    zValidator("json", z.object({
        course_sigle: z.string(),
        year: z.number().min(2013),
        section_number: z.number().min(1).max(100),
        liked: z.boolean(),
        comment: z.string().min(10).max(500),
        estimated_credits: z.number().min(1),
    })),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    async (c) => {
        try {
            const { year, course_sigle, section_number, liked, comment, estimated_credits } = c.req.valid("json")
            const payload: TokenPayload = c.get("jwtPayload")
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
                    payload.email_hash,
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
    }
);

app.put(
    "/",
    zValidator(
        "json",
        z.object({
            course_sigle: z.string(),
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
    verifyTokenMiddleware,
    async (c) => {
        try {
            const { course_sigle, year, section_number, liked, comment, estimated_credits } =
                c.req.valid("json");

            const payload: TokenPayload = c.get("jwtPayload")

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
                    payload.email_hash,
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
        })
    ),
    zValidator(
        "header",
        HeaderSchema
    ),
    verifyTokenMiddleware,
    async (c) => {
        try {
            const { course_sigle } = c.req.valid("json");
            const payload: TokenPayload = c.get("jwtPayload")

            const result = await c.env.DB.prepare(`
                DELETE FROM review
                WHERE email_hash = ? AND course_sigle = ?
            `)
                .bind(payload?.email_hash, course_sigle)
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