import createHono from './lib/honoBase';
import auth from './routes/global/auth/route'
import general from "./routes/global/general/route"
import course from "./routes/global/courses/route"
import userReviews from "./routes/users/reviews/route"
import userPanel from "./routes/users/panel/route"
import reviews from "./routes/global/reviews/route"
import adminCourse from "./routes/admin/courses/route"
import adminReviews from "./routes/admin/reviews/get"
import adminUserPermission from "./routes/admin/users/permission/route"
import adminUserManager from "./routes/admin/users/manager/route"

import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui';

const app = createHono()

app.use("/*", cors())
app.get('/ui', swaggerUI({ url: '/doc' }))

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
app.route("/admin/course", adminCourse)
app.route("/admin/reviews", adminReviews)
app.route("/admin/user/permission", adminUserPermission)
app.route("/admin/user/manager", adminUserManager)

export default app