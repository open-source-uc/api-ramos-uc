import createHono from './lib/honoBase';
import auth from './routes/auth/route'
import career from "./routes/career/route"
import { cors } from 'hono/cors'

const app = createHono()

app.use("/*", cors())

app.get('/', (c) => c.json({
  message: "Hola mundo",
  date: "2025-01-31",
}))

app.route("/career", career)
app.route('/auth', auth)




export default app