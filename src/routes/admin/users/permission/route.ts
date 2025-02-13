import { z } from "zod";
import createHono from "../../../../lib/honoBase";
import { createRoute } from "@hono/zod-openapi";

const app = createHono().openapi(createRoute({
    path: "/{email_hash}",
    method: 'get',
    tags: ['admin permission'],
    security: [
        {
            osuctoken: []
        }
    ],
    request: {
        params: z.object({
            email_hash: z.string()
        })
    },
    responses: {
        200: {
            description: "Return all permissions of user",
            content: {
                'application/json': {
                    schema: z.object({
                        permissions: z.array(z.object({
                            permission_id: z.number()
                        }))
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
    },
}), async (c) => {
    try {
        const { email_hash } = c.req.valid("param");

        const result = await c.env.DB.prepare(`
            SELECT permission_id FROM userpermission WHERE email_hash = ?
        `)
            .bind(email_hash)
            .all<{
                permission_id: number
            }>();

        return c.json({
            permissions: result.results
        }, 200)
    } catch {
        return c.json({ "message": "An error occurred while get the permission" }, 500);
    }
}).openapi(
    createRoute({
        path: "/",
        method: 'post',
        tags: ['admin permission'],
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
                            email_hash: z.string(),
                            permission_id: z.number()
                        }),
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Permission added",
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
        const { email_hash, permission_id } = c.req.valid("json");

        try {
            await c.env.DB.prepare(`
                INSERT INTO userpermission(email_hash, permission_id) VALUES (?, ?)
            `)
                .bind(email_hash, permission_id)
                .run();

            return c.json({
                "message": "ok"
            }, 201);
        } catch {
            return c.json({ "message": "The user already has this permission" }, 500);
        }
    }
).openapi(
    createRoute({
        path: "/",
        method: 'delete',
        tags: ['admin permission'],
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
                            email_hash: z.string(),
                            permission_id: z.number()
                        }),
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Permission deleted",
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
        const { email_hash, permission_id } = c.req.valid("json");

        try {
            await c.env.DB.prepare(`
                DELETE FROM userpermission WHERE email_hash = ? AND permission_id = ?
            `)
                .bind(email_hash, permission_id)
                .run();

            return c.json({
                "message": "Permission deleted"
            }, 200);
        } catch {
            return c.json({ "message": "An error occurred while deleting the permission" }, 500);
        }
    }
).openapi(createRoute({
    path: "/list",
    method: 'get',
    tags: ['admin permission'],
    security: [
        {
            osuctoken: []
        }
    ],
    description: "Get all permissions of API",
    responses: {
        200: {
            description: "Return all permissions",
            content: {
                'application/json': {
                    schema: z.object({
                        permissions: z.array(z.object({
                            id: z.number(),
                            permission_name: z.string(),
                        }))
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
}), async (c) => {
    try {
        const result = await c.env.DB.prepare(`
            SELECT * FROM permission
        `)
            .all<{
                id: number,
                permission_name: string
            }>();

        return c.json({
            permissions: result.results,
            meta: result.meta
        }, 200)
    } catch {
        return c.json({ "message": "An error occurred while get the permissions" }, 500);
    }
})


export default app