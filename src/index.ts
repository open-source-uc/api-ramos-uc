import createHono from './lib/honoBase';
import auth from './routes/global/auth/route'
import general from "./routes/global/general/route"
import course from "./routes/global/courses/route"
import userReviews from "./routes/users/reviews/route"
import userPanel from "./routes/users/panel/route"
import reviews from "./routes/global/reviews/route"
import bots from "./routes/bots/route"
// import adminCourse from "./routes/admin/courses/route"
// import adminReviews from "./routes/admin/reviews/get"
import adminUserPermission from "./routes/admin/users/permission/route"
import adminUserManager from "./routes/admin/users/manager/route"
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
// app.use("/auth/*", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.AUTH))
app.use("/general/*", verifyTokenMiddleware)
app.use("/reviews/*", verifyTokenMiddleware)
app.use("/course/*", verifyTokenMiddleware)
app.use("/user/panel/*", verifyTokenMiddleware)
app.use("/user/reviews/*", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.CREATE_EDIT_OWN_REVIEW))
app.use("/bots/*", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.UPDATE_QUOTA))


app.use("/admin/*", verifyTokenMiddleware, verifyPermisionMiddleware(PERMISSIONS.ADMIN))
const routes = app.route("/course", course)
  .route('/auth', auth)
  .route("/general", general)
  .route("/reviews", reviews)
  .route("/user/panel", userPanel)
  .route("/user/reviews", userReviews)
  .route("/bots", bots)
  .route("/admin/user/permission", adminUserPermission)
  .route("/admin/user/manager", adminUserManager)

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Ramos UC API",
    version: "1.0.0",
  },
})

app.get('/', swaggerUI({ url: '/doc' }))

export default app

export type AppType = typeof routes