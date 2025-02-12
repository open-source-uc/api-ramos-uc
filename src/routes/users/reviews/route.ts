import createHono from "../../../lib/honoBase";
import { z } from "zod";
import { TokenPayload } from "../../../lib/middlewares/token";
import { createRoute } from "@hono/zod-openapi";

const app = createHono().openapi(
    createRoute({
        method: 'post',
        path: "/",
        tags: ['user reviews'],
        security: [
            {
                osuctoken: []
            }
        ],
        description: "Crear review con la id que esta en el token",
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            course_id: z.number(),
                            year: z.number(),
                            section_number: z.number().min(1).max(100),
                            liked: z.boolean(),
                            comment: z.string().min(10).max(500),
                            estimated_credits: z.number().min(1),
                        }),
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Reseña creada exitosamente",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            500: {
                description: "Error interno",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            400: {
                description: "Error de validación",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            }
        }
    }),
    async (c) => {
        try {
            const { year, course_id, section_number, liked, comment, estimated_credits } = c.req.valid("json")
            const currentYear = new Date().getFullYear()
            if (!(currentYear - 12 <= year))
                return c.json({
                    message: "El año de admision debe ser mayor o igual a " + (currentYear - 12)
                }, 400)


            const payload: TokenPayload = c.get("jwtPayload")
            await c.env.DB.prepare(`
                INSERT INTO review(
                course_id, 
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
                    course_id,
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

        } catch {
            return c.json(
                {
                    message: "Server Error",
                },
                500
            );
        }
    }
).openapi(
    createRoute({
        method: 'put',
        path: "/",
        tags: ["user reviews"],
        description: "Actualizar review con la id de usuario que esta en el token",
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            course_id: z.number(),
                            year: z.number(),
                            section_number: z.number().min(1).max(100),
                            liked: z.boolean(),
                            comment: z.string().min(10).max(500),
                            estimated_credits: z.number().min(1),
                        }),
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Reseña actualizada correctamente",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            404: {
                description: "Reseña no encontrada",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            500: {
                description: "Error interno",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            400: {
                description: "Error de validación",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            }
        }
    }), async (c) => {
        try {
            const { course_id, year, section_number, liked, comment, estimated_credits } =
                c.req.valid("json");

            const currentYear = new Date().getFullYear()
            if (!(currentYear - 12 <= year))
                return c.json({
                    message: "El año de admision debe ser mayor o igual a " + (currentYear - 12)
                }, 400)

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
              WHERE email_hash = ? AND course_id = ?
              `
            )
                .bind(
                    year,
                    section_number,
                    liked,
                    comment,
                    estimated_credits,
                    payload.email_hash,
                    course_id
                )
                .run();

            if (result.meta.changes === 0) {
                return c.json({ message: "Reseña no encontrada" }, 404);
            }

            return c.json({ message: "Reseña actualizada correctamente" }, 200);
        } catch {
            return c.json(
                {
                    message: "Server Error",
                },
                500
            );
        }
    }
).openapi(
    createRoute({
        method: 'delete',
        path: "/",
        tags: ["user reviews"],
        description: "Actualizar review con la id de usuario que esta en el token",
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            course_id: z.number(),
                        }),
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Reseña eliminada correctamente",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            404: {
                description: "Reseña no encontrada",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            500: {
                description: "Error interno",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            }
        }
    }),
    async (c) => {
        try {
            const { course_id } = c.req.valid("json");
            const payload: TokenPayload = c.get("jwtPayload")

            const result = await c.env.DB.prepare(`
                DELETE FROM review
                WHERE email_hash = ? AND course_id = ?
            `)
                .bind(payload?.email_hash, course_id)
                .run();

            if (result.meta.changes === 0) {
                return c.json({ message: "Reseña no encontrada" }, 404);
            }

            return c.json({ message: "Reseña eliminada correctamente" }, 200);
        } catch {
            return c.json(
                {
                    message: "Server Error",
                },
                500
            );
        }
    }
);



export default app