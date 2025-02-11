import { createRoute, z } from "@hono/zod-openapi";
import createHono from "../../lib/honoBase";

const app = createHono().openapi(
    createRoute({
        path: '/course',
        method: 'post',
        tags: ['bot'],
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
                            sigle: z.string(),
                            name: z.string(),
                            credits: z.number().min(0),
                            school_id: z.number().min(1),
                            area_id: z.number().min(1),
                            category_id: z.number().min(1),
                        }),
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Curso creado exitosamente",
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
            const { sigle, name, credits, school_id, area_id, category_id } = c.req.valid("json")
            await c.env.DB.prepare("INSERT INTO course (sigle, name, credits, school_id, area_id, category_id) VALUES (?, ?, ?, ?, ?, ?)").bind(sigle, name, credits, school_id, area_id, category_id).run()

            return c.json({ message: "Curso creado exitosamente" }, 201)
        } catch (error) {
            console.log(error)
            return c.json({ message: "Error interno" }, 500)
        }
    }
)

export default app