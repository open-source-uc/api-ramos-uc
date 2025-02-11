import { createRoute, z } from "@hono/zod-openapi";
import createHono from "../../../../lib/honoBase";
import { sha256 } from "../../../../lib/hash";

const app = createHono()

app.openapi(createRoute({
    path: "/list",
    method: 'get',
    tags: ['admin user manager'],
    security: [
        {
            osuctoken: []
        }
    ],
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
    } catch (error) {
        return c.json({ "message": "An error occurred while get the permissions" }, 500);
    }
})

app.openapi(createRoute({
    path: "/",
    method: 'get',
    tags: ['admin user manager'],
    security: [
        {
            osuctoken: []
        }
    ],
    responses: {
        200: {
            description: "Return all users",
            content: {
                'application/json': {
                    schema: z.object({
                        users: z.array(z.object({
                            email_hash: z.string(),
                            password: z.string(),
                            nickname: z.string(),
                            admission_year: z.number(),
                            career_id: z.number(),
                            token_version: z.string(),
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
        },
        404: {
            description: "User not found",
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
            SELECT * FROM useraccount LIMIT 50
        `)
            .all<{
                email_hash: string,
                password: string,
                nickname: string,
                admission_year: number,
                career_id: number,
                token_version: string
            }>();

        if (!result) {
            return c.json({ "message": "User not found" }, 404);
        }

        return c.json({
            users: result.results,
            meta: result.meta
        }, 200)

    } catch (error) {
        console.log(error)
        return c.json({ "message": "An error occurred while get the user" }, 500);
    }
})


app.openapi(createRoute({
    path: "/{email}",
    method: 'get',
    tags: ['admin user manager'],
    security: [
        {
            osuctoken: []
        }
    ],
    request: {
        params: z.object({
            email: z.string()
        })
    },
    responses: {
        200: {
            description: "Return all users",
            content: {
                'application/json': {
                    schema: z.object({
                        user: z.object({
                            email_hash: z.string(),
                            password: z.string(),
                            nickname: z.string(),
                            admission_year: z.number(),
                            career_id: z.number(),
                            token_version: z.string(),
                        })
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
        404: {
            description: "User not found",
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

        const { email } = c.req.valid("param");
        const email_hash = await sha256(email)

        const result = await c.env.DB.prepare(`
            SELECT * FROM useraccount WHERE email_hash = ?
        `)
            .bind(email_hash)
            .first<{
                email_hash: string,
                password: string,
                nickname: string,
                admission_year: number,
                career_id: number,
                token_version: string
            }>();

        if (!result) {
            return c.json({ "message": "User not found" }, 404);
        }

        return c.json({
            user: result,
        }, 200)

    } catch (error) {
        console.log(error)
        return c.json({ "message": "An error occurred while get the user" }, 500);
    }
})


export default app