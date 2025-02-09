import { createRoute } from "@hono/zod-openapi";
import createHono from "../../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod"

const app = createHono()

app.openapi(
    createRoute({
        path: "/",
        method: "get",
        request: {
            query: z.object({
                start_id: z.string().transform((val) => parseInt(val, 10))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" }).optional(),
                school_id: z.string().transform((val) => parseInt(val, 10))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
                    .refine((val) => val >= 0 && val <= 1000, {
                        message: 'El parámetro "school_id" debe estar entre 0 y 1000',
                    }).optional(),
            }),
        },
        responses: {
            200: {
                description: "Lista de cursos",
                content: {
                    "application/json": {
                        schema: z.object({
                            courses: z.array(z.object({
                                course_id: z.number(),
                                sigle: z.string(),
                                name: z.string(),
                                category_id: z.number(),
                                school_id: z.number(),
                                area_id: z.number(),
                                credits: z.number(),
                                promedio: z.number(),
                                promedio_creditos_est: z.number()
                            }))
                        })
                    }
                }
            },
            500: {
                description: "Error interno",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
            }
        }
    }),
    async (c) => {
        const { start_id, school_id } = c.req.valid("query")

        const bindings = []

        if (school_id)
            bindings.push(school_id)
        if (start_id)
            bindings.push(start_id)

        const query = c.env.DB.prepare(`
            SELECT 
                course_id,
                sigle,
                name,
                category_id,
                school_id,
                area_id,
                credits,
                promedio,
                promedio_creditos_est
            FROM course_reviews
            ${(school_id !== undefined || start_id !== undefined)
                ? `WHERE ${school_id ? (start_id ? 'school_id = ? AND course_id > ?' : 'school_id = ?') : 'course_id > ?'}`
                : ''}
            ORDER BY promedio DESC, course_id ASC
            LIMIT 50
            `)

        const result = await query.bind(...bindings).all<{
            course_id: number
            sigle: string;
            name: string;
            category_id: number;
            school_id: number;
            area_id: number;
            credits: number;
            promedio: number;
            promedio_creditos_est: number;
        }>()

        return c.json({ courses: result.results, meta: result.meta }, 200)
    }
)

app.openapi(createRoute({
    path: "/ofg",
    method: "get",
    request: {
        query: z.object({
            start_id: z.string().transform((val) => parseInt(val, 10))
                .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" }).optional(),
            area_id: z.string().transform((val) => parseInt(val, 10))
                .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
                .refine((val) => val > 0 && val <= 1000, {
                    message: 'El parámetro "area_id" debe estar entre 1 y 1000',
                }).optional(),
        })
    },
    responses: {
        200: {
            description: "Lista de cursos",
            content: {
                "application/json": {
                    schema: z.object({
                        courses: z.array(z.object({
                            course_id: z.number(),
                            sigle: z.string(),
                            name: z.string(),
                            category_id: z.number(),
                            school_id: z.number(),
                            area_id: z.number(),
                            credits: z.number(),
                            promedio: z.number(),
                            promedio_creditos_est: z.number()
                        }))
                    })
                }
            }
        },
        500: {
            description: "Error interno",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        }
    }
}),
    async (c) => {
        const { start_id, area_id } = c.req.valid("query")

        const bindings = []

        if (area_id)
            bindings.push(area_id)
        if (start_id)
            bindings.push(start_id)


        const query = c.env.DB.prepare(`
        SELECT 
        course_id,
        sigle,
        name,
        category_id,
        school_id,
        area_id,
        credits,
        promedio,
        promedio_creditos_est
        FROM course_reviews
        WHERE
            ${(area_id !== undefined || start_id !== undefined)
                ? `${area_id ? (start_id ? 'area_id = ? AND course_id > ?' : 'area_id = ?') : 'course_id > ?'}`
                : 'area_id > 0'}
        ORDER BY promedio DESC, course_id ASC
        LIMIT 50
        `)

        const result = await query.bind(...bindings).all<{
            course_id: number
            sigle: string;
            name: string;
            category_id: number;
            school_id: number;
            area_id: number;
            credits: number;
            promedio: number;
            promedio_creditos_est: number;
        }>()

        return c.json({ courses: result.results, meta: result.meta }, 200)
    }
)

export default app
