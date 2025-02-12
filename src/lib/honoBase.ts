import { OpenAPIHono } from '@hono/zod-openapi'

export type Bindings = {
    DB: D1Database;
    SECRET_GLOBAL_KEY: string;
};

export default function createHono() {
    const app = new OpenAPIHono<{ Bindings: Bindings }>({
        defaultHook: (r, c) => {
            if (!r.success) {
                return c.json(
                    {
                        message: r.error.errors?.[0].message ?? "Error en los datos enviados",
                    },
                    400
                )
            }
        }
    })
    return app
}