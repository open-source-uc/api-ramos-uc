import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../../lib/schemas/general";
import createHono from "../../../lib/honoBase";

const app = createHono().openapi(
    createRoute({
        path: "/{review_id}",
        method: "delete",
        tags: ["admin review manager"],
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            params: z.object({
                review_id: z.number()
            })
        },
        responses: {
            200: {
                description: "Review deleted",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            404: {
                description: "Review not found",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            400: {
                description: "Error en los datos enviados",
                content: {
                    'application/json': {
                        schema: ErrorSchema
                    },
                }
            },
            500: {
                description: "Error interno",
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    },
                },
            }
        }
    }),
    async (c) => {
        try {
            const { review_id } = c.req.valid("param");
            const result = await c.env.DB.prepare(`
                DELETE FROM review WHERE id = ?    
            `).bind(review_id).run();

            if (result.meta.changes === 0) {
                return c.json({ message: "Review not found" }, 404);
            }

            return c.json({ message: "Review deleted" }, 200);

        } catch {
            return c.json({ message: "An error occurred while deleting the review" }, 500);
        }
    }
).openapi({
    method: "put",
    path: "/{review_id}",
    tags: ["admin review manager"],
    security: [
        {
            osuctoken: []
        }
    ],
    request: {
        params: z.object({
            review_id: z.number()
        }),
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        year: z.number(),
                        section_number: z.number().min(1).max(100),
                        liked: z.boolean(),
                        comment: z.string().min(10).max(500),
                        estimated_credits: z.number().min(1),
                        status: z.enum(["visible", "hidden"])
                    })
                }
            }
        },
    },
    responses: {
        200: {
            description: "Review updated",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    }),
                },
            },
        },
        404: {
            description: "Review not found",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        400: {
            description: "Error en los datos enviados",
            content: {
                'application/json': {
                    schema: ErrorSchema
                },
            }
        },
        500: {
            description: "Error interno",
            content: {
                "application/json": {
                    schema: ErrorSchema
                },
            },
        }
    }
}, async (c) => {
    try {
        const { review_id } = c.req.valid("param");
        const { year, section_number, liked, comment, estimated_credits, status } = c.req.valid("json");

        const result = await c.env.DB.prepare(`
            UPDATE review SET 
                year = ?,
                section_number = ?,
                liked = ?,
                comment = ?,
                estimated_credits = ?,
                status = ?
            WHERE id = ?
        `).bind(year, section_number, liked, comment, estimated_credits, status, review_id).run();

        if (result.meta.changes === 0) {
            return c.json({ message: "Review not found" }, 404);
        }

        return c.json({ message: "Review updated" }, 200)
    } catch {
        return c.json({ message: "An error occurred while updating the review" }, 500);
    }
}).openapi({
    method: "get",
    path: "/",
    tags: ["admin review manager"],
    security: [
        {
            osuctoken: []
        }
    ],
    request: {
        query: z.object({
            first_date: z.date().optional(),
        })
    },
    responses: {
        200: {
            description: "List of reviews",
            content: {
                "application/json": {
                    schema: z.object({
                        reviews: z.array(z.object({
                            id: z.number(),
                            course_id: z.number(),
                            email_hash: z.string(),
                            year: z.number(),
                            section_number: z.number(),
                            liked: z.boolean(),
                            comment: z.string(),
                            estimated_credits: z.number(),
                            status: z.enum(["visible", "hidden"])
                        }))
                    }),
                },
            },
        },
        500: {
            description: "Internal error",
            content: {
                "application/json": {
                    schema: ErrorSchema
                },
            },
        }
    }
}, async (c) => {
    try {
        const { first_date } = c.req.valid("query");
        const reviews = await c.env.DB.prepare(`
            SELECT 
            id, course_id, email_hash, year, section_number, liked, comment, estimated_credits, status, date
            FROM review
            WHERE date < ?
            ORDER BY date DESC
            LIMIT 50
        `).bind(first_date ?? new Date().toISOString().split('T')[0]).all<{
            id: number,
            course_id: number,
            email_hash: string
            year: number,
            section_number: number,
            liked: boolean,
            comment: string,
            estimated_credits: number,
            status: "visible" | "hidden"
        }>();

        return c.json({ reviews: reviews.results, meta: reviews.meta }, 200);
    } catch {
        return c.json({ message: "An error occurred while fetching the reviews" }, 500);
    }
})

export default app