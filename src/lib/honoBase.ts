import { Hono } from 'hono'

type Bindings = {
    DB: D1Database;
    SECRET_GLOBAL_KEY: string;
};

export default function createHono() {
    const app = new Hono<{ Bindings: Bindings }>()
    return app
}