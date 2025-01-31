import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))
app.get('/api/v1/', (c) => c.json({
  message: "Hola mundo",
  date: "2025-01-31",
}))

export default app