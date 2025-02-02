import { zValidator } from "@hono/zod-validator";
import createHono from "../../../lib/honoBase";
import { z } from "zod";

const app = createHono()

// 1. Route for get all reviews 50 x page
app.get("/", zValidator("query", z.object({
    page: z.string().transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
        .refine((val) => val >= 0 && val <= 1000, {
            message: 'El parámetro "page" debe estar entre 0 y 1000',
        }).optional(),
})), async (c) => {

    const { page } = c.req.valid("query")

    const result = await c.env.DB.prepare(`
        SELECT 
            r.course_sigle,
            r.year,
            r.section_number,
            r.liked,
            r.comment,
            r.estimated_credits,
            r.date,
            ua.nickname
        FROM review AS r
        JOIN useraccount AS ua 
            ON r.email_hash = ua.email_hash
        WHERE r.status = 'visible'
        LIMIT 50 
        OFFSET 50 * (?);
    `).bind(page ?? 0).run()

    return c.json({ reviews: result.results }, 200)
})

app.get("/course/:sigle",
    zValidator("param", z.object({
        sigle: z.string()
    })),
    zValidator("query", z.object({
        page: z.string().transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
            .refine((val) => val >= 0 && val <= 1000, {
                message: 'El parámetro "page" debe estar entre 0 y 1000',
            }).optional(),
    })), async (c) => {

        const { sigle } = c.req.valid("param")
        const { page } = c.req.valid("query")

        const result = await c.env.DB.prepare(`
            SELECT 
                r.course_sigle,
                r.year,
                r.section_number,
                r.liked,
                r.comment,
                r.estimated_credits,
                r.date,
                ua.nickname
            FROM review AS r
            JOIN useraccount AS ua 
                ON r.email_hash = ua.email_hash
            WHERE 
            r.status = 'visible' 
            AND
            r.course_sigle = ?
            LIMIT 50 
            OFFSET 50 * (?);
        `).bind(sigle, page ?? 0).run()

        if (result.meta.rows_read === 0)
            return c.json({ message: "Not found any review" }, 404)

        return c.json({ reviews: result.results }, 200)

    })

app.get("/user/:nickname",
    zValidator("param", z.object({
        nickname: z.string()
    })),
    zValidator("query", z.object({
        page: z.string().transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
            .refine((val) => val >= 0 && val <= 1000, {
                message: 'El parámetro "page" debe estar entre 0 y 1000',
            }).optional(),
    })), async (c) => {

        const { nickname } = c.req.valid("param")
        const { page } = c.req.valid("query")

        const result = await c.env.DB.prepare(`
            SELECT 
                r.course_sigle,
                r.year,
                r.section_number,
                r.liked,
                r.comment,
                r.estimated_credits,
                r.date,
                ua.nickname
            FROM review AS r
            JOIN useraccount AS ua 
                ON r.email_hash = ua.email_hash
            WHERE 
            r.status = 'visible' 
            AND
            ua.nickname = ?
            LIMIT 50 
            OFFSET 50 * (?);
        `).bind(nickname, page ?? 0).run()

        if (result.meta.rows_read === 0)
            return c.json({ message: "Not found any review" }, 404)

        return c.json({ reviews: result.results }, 200)
    })

export default app