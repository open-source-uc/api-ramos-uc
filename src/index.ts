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
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'

const app = createHono()

app.use("/*", cors())

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

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Ramos UC API",
    version: "1.0.0",
  },
})

app.get('/', swaggerUI({ url: '/doc' }))

export default app