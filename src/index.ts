import createHono from './lib/honoBase';
import auth from './routes/auth/route'
import { cors } from 'hono/cors'

const app = createHono()

app.use("/*", cors())

app.get('/', (c) => c.json({
  message: "Hola mundo",
  date: "2025-01-31",
}))

app.route('/auth', auth)

// app.get('/test', (c) => {
//   return c.env.DB.prepare("SELECT name FROM career")
//     .all()
//     .then((data) => c.json(data))
//     .catch((error) => c.json({ message: error.message }, 500));
// });


export default app