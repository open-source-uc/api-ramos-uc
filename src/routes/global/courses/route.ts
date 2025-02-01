import createHono from "../../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod"

const app = createHono()

app.get(
    "/",
    zValidator("query", z.object({
        page: z.string().transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
            .refine((val) => val >= 0 && val <= 1000, {
                message: 'El parámetro "page" debe estar entre 0 y 1000',
            }).optional(),
        sigle: z.string().optional(),
        area: z.enum([
            "Artes",
            "Ecolog Integra y Sustentabilid",
            "Pensamiento Matematico",
            "Ciencias Sociales",
            "Salud y Bienestar",
            "Ciencia y Tecnologia",
            "Humanidades",
            "Formacion Filosofica",
            "Formacion Teologica"
        ]).optional()
    }),
        (result, c) => {
            if (!result.success) {
                return c.json({
                    message: result.error.errors[0]?.message
                }, 400)
            }
        }
    ),
    async (c) => {
        const { page, sigle, area } = c.req.query()
        console.log(page)
        const query = c.env.DB.prepare(`
        SELECT * FROM course
        WHERE
        (? IS NULL OR sigle = ?) 
        AND
        (? IS NULL OR area = ?)
        ORDER BY sigle
        LIMIT 50 OFFSET 50 * (?)
        `)

        const result = await query.bind(sigle ?? null, sigle ?? null, area ?? null, area ?? null, page ?? 0).all()

        return c.json({ result }, 200)
    }
)

app.get(
    "/ofg",
    zValidator("query", z.object({
        page: z.string().transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
            .refine((val) => val >= 0 && val <= 1000, {
                message: 'El parámetro "page" debe estar entre 0 y 1000',
            }).optional(),
        sigle: z.string().optional(),
        area: z.enum([
            "Artes",
            "Ecolog Integra y Sustentabilid",
            "Pensamiento Matematico",
            "Ciencias Sociales",
            "Salud y Bienestar",
            "Ciencia y Tecnologia",
            "Humanidades",
            "Formacion Filosofica",
            "Formacion Teologica"
        ]).optional()
    }),
        (result, c) => {
            if (!result.success) {
                return c.json({
                    message: result.error.errors[0]?.message
                }, 400)
            }
        }
    ),
    async (c) => {
        const { page, sigle, area } = c.req.query()
        console.log(page)
        const query = c.env.DB.prepare(`
        SELECT * FROM course
        WHERE
        area <> ''
        AND
        (? IS NULL OR sigle = ?) 
        AND
        (? IS NULL OR area = ?)
        ORDER BY sigle
        LIMIT 50 OFFSET 50 * (?)
        `)

        const result = await query.bind(sigle ?? null, sigle ?? null, area ?? null, area ?? null, page ?? 0).all()

        return c.json({ result }, 200)
    }
)

export default app
