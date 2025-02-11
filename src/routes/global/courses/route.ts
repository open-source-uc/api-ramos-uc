import { createRoute } from "@hono/zod-openapi";
import createHono from "../../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod"

const app = createHono()
    .openapi(
        createRoute({
            path: "/",
            method: "get",
            tags: ["courses"],
            security: [
                {
                    osuctoken: []
                }
            ],
            request: {
                query: z.object({
                    start_promedio: z.string().transform((val) => parseFloat(val))
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
            const { start_promedio, school_id } = c.req.valid("query")

            const bindings = []

            if (school_id)
                bindings.push(school_id)
            if (start_promedio)
                bindings.push(start_promedio)

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
            ${(school_id !== undefined || start_promedio !== undefined)
                    ? `WHERE ${school_id ? (start_promedio ? 'school_id = ? AND promedio < ?' : 'school_id = ?') : 'promedio < ?'}`
                    : ''}
            ORDER BY promedio DESC
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
    .openapi(createRoute({
        path: "/ofg",
        method: "get",
        tags: ["courses"],
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            query: z.object({
                start_promedio: z.string().transform((val) => parseFloat(val))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" }).optional(),
                area_id: z.string().transform((val) => parseInt(val, 10))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
                    .refine((val) => val > 1 && val <= 1000, {
                        message: 'El parámetro "area_id" debe estar entre 1 y 1000',
                    }),
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
            const { start_promedio, area_id } = c.req.valid("query")

            const bindings = []

            if (area_id)
                bindings.push(area_id)
            if (start_promedio)
                bindings.push(start_promedio)


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
        ${(area_id !== undefined || start_promedio !== undefined)
                    ? `${area_id ? (start_promedio ? 'area_id = ? AND promedio < ?' : 'area_id = ?') : 'promedio < ?'}`
                    : 'area_id > 1'}
        ORDER BY promedio DESC
        LIMIT 50
        `)
            console.log(query)

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
    .openapi(
        createRoute({
            path: "/course_id/{course_id}",
            method: "get",
            tags: ["courses"],
            security: [
                {
                    osuctoken: []
                }
            ],
            request: {
                params: z.object({
                    course_id: z.string().transform((val) => parseInt(val, 10))
                        .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
                })
            },
            responses: {
                200: {
                    description: "Información del curso",
                    content: {
                        "application/json": {
                            schema: z.object({
                                course: z.object({
                                    course_id: z.number(),
                                    sigle: z.string(),
                                    name: z.string(),
                                    category_id: z.number(),
                                    school_id: z.number(),
                                    area_id: z.number(),
                                    credits: z.number(),
                                    promedio: z.number(),
                                    promedio_creditos_est: z.number()
                                })
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
                },
                404: {
                    description: "Curso no encontrado",
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
            try {
                const { course_id } = c.req.valid("param");

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
                WHERE course_id = ?
                LIMIT 1
            `);

                const result = await query.bind(course_id).first<{
                    course_id: number;
                    sigle: string;
                    name: string;
                    category_id: number;
                    school_id: number;
                    area_id: number;
                    credits: number;
                    promedio: number;
                    promedio_creditos_est: number;
                }>();

                if (!result) {
                    return c.json({ message: "Curso no encontrado" }, 404);
                }

                return c.json({ course: result }, 200);
            } catch (error) {
                return c.json({ message: "Server Error" }, 500);
            }
        }
    )
    .openapi(
        createRoute({
            path: "/sigle/{sigle}",
            method: "get",
            tags: ["courses"],
            request: {
                params: z.object({
                    sigle: z.string()
                })
            },
            security: [
                {
                    osuctoken: []
                }
            ],
            responses: {
                200: {
                    description: "Información del curso",
                    content: {
                        "application/json": {
                            schema: z.object({
                                course: z.object({
                                    course_id: z.number(),
                                    sigle: z.string(),
                                    name: z.string(),
                                    category_id: z.number(),
                                    school_id: z.number(),
                                    area_id: z.number(),
                                    credits: z.number(),
                                    promedio: z.number(),
                                    promedio_creditos_est: z.number()
                                })
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
                },
                404: {
                    description: "Curso no encontrado",
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
            try {
                const { sigle } = c.req.valid("param");

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
                WHERE sigle = ?
                LIMIT 1
            `);

                const result = await query.bind(sigle).first<{
                    course_id: number;
                    sigle: string;
                    name: string;
                    category_id: number;
                    school_id: number;
                    area_id: number;
                    credits: number;
                    promedio: number;
                    promedio_creditos_est: number;
                }>();

                if (!result) {
                    return c.json({ message: "Curso no encontrado" }, 404);
                }

                return c.json({ course: result }, 200);
            } catch (error) {
                return c.json({ message: "Server Error" }, 500);
            }
        }
    );


export default app

