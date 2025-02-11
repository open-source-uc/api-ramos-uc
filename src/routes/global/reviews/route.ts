import { zValidator } from "@hono/zod-validator";
import createHono from "../../../lib/honoBase";
import { z } from "zod";
import { createRoute } from "@hono/zod-openapi";

const app = createHono()
    .openapi(createRoute({
        path: "/",
        tags: ["reviews"],
        method: "get",
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            query: z.object({
                review_id_start: z.string().transform((val) => parseInt(val, 10))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un número válido" })
                    .refine((val) => val >= 0, {
                        message: 'El parámetro "page" debe estar entre 0 y 1000',
                    }).optional(),
            })
        },
        responses: {
            200: {
                description: "Success",
                content: {
                    "application/json": {
                        schema: z.object({
                            reviews: z.array(z.object({
                                id: z.number(),
                                course_id: z.number(),
                                year: z.number(),
                                section_number: z.number(),
                                liked: z.boolean(),
                                comment: z.string(),
                                estimated_credits: z.number(),
                                date: z.string(),
                                nickname: z.string()
                            }))
                        })
                    }
                }
            },
            404: {
                description: "Not Found",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
            },
            500: {
                description: "Internal Server Error",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
            }
        }
    }), async (c) => {
        try {
            const { review_id_start } = c.req.valid("query");

            const result = await c.env.DB.prepare(`
            SELECT 
                r.id,
                r.course_id,
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
                AND r.id > ?
            ORDER BY r.date DESC, r.id DESC
            LIMIT 50 
        `).bind(review_id_start ?? 0).all<{
                id: number,
                course_id: number,
                year: number,
                section_number: number,
                liked: boolean,
                comment: string,
                estimated_credits: number,
                date: string,
                nickname: string
            }>();

            if (!result) {
                return c.json({ message: "Not found any review" }, 404);
            }

            return c.json({ reviews: result.results, meta: result.meta }, 200);
        } catch (error) {
            return c.json({ message: "Internal Server Error" }, 500);
        }
    })
    .openapi(createRoute({
        path: "/course/{course_id}",
        method: "get",
        tags: ["reviews"],
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            params: z.object({
                course_id: z.string()
                    .transform((val) => parseInt(val, 10))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un número válido" })
                    .refine((val) => val >= 0, {
                        message: 'El parámetro "course_id" debe ser mayor que 0',
                    })
            }),
            query: z.object({
                review_id_start: z.string().transform((val) => parseInt(val, 10))
                    .refine((val) => !isNaN(val), { message: "Valor debe ser un número válido" })
                    .refine((val) => val >= 0, {
                        message: 'El parámetro "page" debe estar entre 0 y 1000',
                    }).optional(),
            })
        },
        responses: {
            200: {
                description: "Success",
                content: {
                    "application/json": {
                        schema: z.object({
                            reviews: z.array(z.object({
                                id: z.number(),
                                course_id: z.number(),
                                year: z.number(),
                                section_number: z.number(),
                                liked: z.boolean(),
                                comment: z.string(),
                                estimated_credits: z.number(),
                                date: z.string(),
                                nickname: z.string()
                            }))
                        })
                    }
                }
            },
            404: {
                description: "Not Found",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
            },
            500: {
                description: "Internal Server Error",
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
                const { review_id_start } = c.req.valid("query");

                const result = await c.env.DB.prepare(`
            SELECT 
                r.id,
                r.course_id,
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
                AND r.course_id = ?
                AND r.id > ?
            ORDER BY r.date DESC, r.id DESC
            LIMIT 50 
        `).bind(course_id, review_id_start ?? 0).all<{
                    id: number,
                    course_id: number,
                    year: number,
                    section_number: number,
                    liked: boolean,
                    comment: string,
                    estimated_credits: number,
                    date: string,
                    nickname: string
                }>();


                if (!result) {
                    return c.json({ message: "Not found any review" }, 404);
                }

                return c.json({ reviews: result.results, meta: result.meta }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ message: "Internal Server Error" }, 500);
            }
        }).openapi(createRoute({
            path: "/course/{course_id}/{nickname}",
            method: "get",
            tags: ["reviews"],
            security: [
                {
                    osuctoken: []
                }
            ],
            request: {
                params: z.object({
                    course_id: z.string()
                        .transform((val) => parseInt(val, 10))
                        .refine((val) => !isNaN(val), { message: "Valor debe ser un número válido" })
                        .refine((val) => val >= 0, {
                            message: 'El parámetro "course_id" debe ser mayor que 0',
                        }),
                    nickname: z.string()
                }),
            },
            responses: {
                200: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: z.object({
                                reviews: z.object({
                                    id: z.number(),
                                    course_id: z.number(),
                                    year: z.number(),
                                    section_number: z.number(),
                                    liked: z.boolean(),
                                    comment: z.string(),
                                    estimated_credits: z.number(),
                                    date: z.string(),
                                    nickname: z.string()
                                })
                            })
                        }
                    }
                },
                404: {
                    description: "Not Found",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string()
                            })
                        }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string()
                            })
                        }
                    }
                }
            }
        }), async (c) => {
            try {
                const { course_id, nickname } = c.req.valid("param");

                const result = await c.env.DB.prepare(`
            SELECT 
                r.id,
                r.course_id,
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
                AND r.course_id = ?
                AND ua.nickname = ?
            ORDER BY r.date DESC, r.id DESC
        `).bind(course_id, nickname).first<{
                    id: number,
                    course_id: number,
                    year: number,
                    section_number: number,
                    liked: boolean,
                    comment: string,
                    estimated_credits: number,
                    date: string,
                    nickname: string
                }>();

                if (!result) {
                    return c.json({ message: "Not found any review" }, 404);
                }

                return c.json({ reviews: result }, 200);
            } catch (error) {
                return c.json({ message: "Internal Server Error" }, 500);
            }
        }).openapi(createRoute({
            path: "/user/{nickname}",
            method: "get",
            tags: ["reviews"],
            security: [
                {
                    osuctoken: []
                }
            ],
            request: {
                params: z.object({
                    nickname: z.string()
                }),
                query: z.object({
                    review_id_start: z.string().transform((val) => parseInt(val, 10))
                        .refine((val) => !isNaN(val), { message: "Valor debe ser un número válido" })
                        .refine((val) => val >= 0, {
                            message: 'El parámetro "page" debe estar entre 0 y 1000',
                        }).optional(),
                })
            },
            responses: {
                200: {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: z.object({
                                reviews: z.array(z.object({
                                    id: z.number(),
                                    course_id: z.number(),
                                    year: z.number(),
                                    section_number: z.number(),
                                    liked: z.boolean(),
                                    comment: z.string(),
                                    estimated_credits: z.number(),
                                    date: z.string(),
                                    nickname: z.string()
                                }))
                            })
                        }
                    }
                },
                404: {
                    description: "Not Found",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string()
                            })
                        }
                    }
                },
                500: {
                    description: "Internal Server Error",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string()
                            })
                        }
                    }
                }
            }
        }), async (c) => {
            try {
                const { nickname } = c.req.valid("param");
                const { review_id_start } = c.req.valid("query");

                const result = await c.env.DB.prepare(`
            SELECT 
                r.id,
                r.course_id,
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
                AND ua.nickname = ?
                AND r.id > ?
            ORDER BY r.date DESC, r.id DESC
            LIMIT 50 
        `).bind(nickname, review_id_start ?? 0).all<{
                    id: number,
                    course_id: number,
                    year: number,
                    section_number: number,
                    liked: boolean,
                    comment: string,
                    estimated_credits: number,
                    date: string,
                    nickname: string
                }>();

                if (!result) {
                    return c.json({ message: "Not found any review" }, 404);
                }

                return c.json({ reviews: result.results, meta: result.meta }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ message: "Internal Server Error" }, 500);
            }
        })

export default app