import createHono from './lib/honoBase';
import auth from './routes/global/auth/route'
import general from "./routes/global/general/route"
import course from "./routes/global/courses/route"
import userReviews from "./routes/users/reviews/route"
import userPanel from "./routes/users/panel/route"
import reviews from "./routes/global/reviews/route"
// import adminCourse from "./routes/admin/courses/route"
// import adminReviews from "./routes/admin/reviews/get"
// import adminUserPermission from "./routes/admin/users/permission/route"
// import adminUserManager from "./routes/admin/users/manager/route"
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { verifyTokenMiddleware } from './lib/middlewares/token';
import { verifyPermisionMiddleware } from './lib/middlewares/perms';
import { PERMISSIONS } from './lib/enums';

const app = createHono()

app.openAPIRegistry.registerComponent("securitySchemes", "osuctoken", {
  type: "http",
  scheme: "bearer",
  in: "header",
  description: "Bearer token",
})
app.use("/*", cors())
app.use("/user/panel/*", verifyTokenMiddleware)
app.use("/user/reviews/*", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.CREATE_EDIT_OWN_REVIEW))
// app.use("/auth/register", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.CREATE_USER))
app.use("/admin/*", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.ADMIN))

app.route('/auth', auth)
app.route("/general", general)
app.route("/reviews", reviews)
app.route("/course", course)
app.route("/user/reviews", userReviews)
app.route("/user/panel", userPanel)
// app.route("/admin/course", adminCourse)
// app.route("/admin/reviews", adminReviews)
// app.route("/admin/user/permission", adminUserPermission)
// app.route("/admin/user/manager", adminUserManager)

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Ramos UC API",
    version: "1.0.0",
  },
})

app.get('/', swaggerUI({ url: '/doc' }))

export default app