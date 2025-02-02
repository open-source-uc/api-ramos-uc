import createHono from './lib/honoBase';
import auth from './routes/global/auth/route'
import general from "./routes/global/general/route"
import course from "./routes/global/courses/route"
import userReviews from "./routes/users/reviews/route"
import userPanel from "./routes/users/panel/route"
import reviews from "./routes/global/reviews/route"
import { cors } from 'hono/cors'

const app = createHono()

app.use("/*", cors())

app.get('/', (c) => c.json({
  message: "Hola mundo",
  date: "2025-01-31",
}))

app.route("/general", general)
app.route('/auth', auth)
app.route("/course", course)
app.route("/user/reviews", userReviews)
app.route("/user", userPanel)
app.route("/reviews", reviews)
export default app