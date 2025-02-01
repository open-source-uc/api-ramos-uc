import createHono from './lib/honoBase';
import auth from './routes/global/auth/route'
import career from "./routes/global/career/route"
import course from "./routes/global/courses/route"
import { cors } from 'hono/cors'

const app = createHono()

app.use("/*", cors())

app.get('/', (c) => c.json({
  message: "Hola mundo",
  date: "2025-01-31",
}))

app.route("/career", career)
app.route('/auth', auth)
app.route("/course", course)

export default app