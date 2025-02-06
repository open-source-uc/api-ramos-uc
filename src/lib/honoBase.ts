import { OpenAPIHono } from '@hono/zod-openapi'

export type Bindings = {
    DB: D1Database;
    SECRET_GLOBAL_KEY: string;
};

export default function createHono() {
    const app = new OpenAPIHono<{ Bindings: Bindings }>()
    return app
}