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
        school: z.enum([
            "Actuación",
            "Agronomía Y Sistemas Naturales",
            "Antropología",
            "Arquitectura",
            "Arte",
            "Escuela De Gobierno",
            "Estudios Urbanos",
            "Economía Y Administración",
            "Escuela De Medicina",
            "Ingeniería",
            "CARA",
            "Astrofísica",
            "Matemáticas",
            "Bachillerato Inicia",
            "Ciencia Política",
            "Ciencias Biológicas",
            "Educación",
            "Escuela Ciencias De La Salud",
            "Escuela De Enfermería",
            "Estética",
            "Historia",
            "Ingeniería Biológica Y Médica",
            "Letras",
            "Música",
            "Química",
            "Teología",
            "Actividades Universitarias",
            "College",
            "Comunicaciones",
            "Construcción Civil",
            "Sociología",
            "Trabajo Social",
            "Derecho",
            "Diseño",
            "Escuela De Odontología",
            "Cursos Deportivos",
            "Ing Matemática Y Computacional",
            "Psicología",
            "Instituto De Éticas Aplicadas",
            "Geografía",
            "Filosofía",
            "Física",
            "Medicina Veterinaria",
            "Cursos y Test de Inglés",
            "Villarrica",
            "Escuela De Graduados",
            "Desarrollo Sustentable"
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
        const { page, sigle, school } = c.req.valid("query")

        const query = c.env.DB.prepare(`
        SELECT * FROM course_reviews_avg
        WHERE
        (? IS NULL OR sigle = ?) 
        AND
        (? IS NULL OR school = ?)
        LIMIT 50 OFFSET 50 * (?)
        `)

        const result = await query.bind(sigle ?? null, sigle ?? null, school ?? null, school ?? null, page ?? 0).all()

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
        SELECT * FROM course_reviews_avg
        WHERE
        area <> ''
        AND
        (? IS NULL OR sigle = ?) 
        AND
        (? IS NULL OR area = ?)
        LIMIT 50 OFFSET 50 * (?)
        `)

        const result = await query.bind(sigle ?? null, sigle ?? null, area ?? null, area ?? null, page ?? 0).all()

        return c.json({ result }, 200)
    }
)

export default app
