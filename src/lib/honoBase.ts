import { Hono } from 'hono'

type Bindings = {
    DB: D1Database;
};

export default function createHono() {
    const app = new Hono<{ Bindings: Bindings }>()
    return app
}