// //1. create courses

// import { zValidator } from "@hono/zod-validator";
// import createHono from "../../../lib/honoBase";
// import { z } from "zod";
// import { HeaderSchema } from "../../../lib/header";
// import { verifyTokenMiddleware } from "../../../lib/middlewares/token";
// import { PERMISSIONS, verifyTokenOnePermision } from "../../../lib/middlewares/perms";

// const app = createHono()

// const sudoMiddleware = verifyTokenOnePermision(PERMISSIONS.SUDO)

// app.post(
//     "/",
//     zValidator("json", z.object({
//         sigle: z.string().min(1),
//         name: z.string().min(1),
//         credits: z.number().min(1).max(100),
//         school: z.string(),
//         area: z.string(),
//         category: z.string()
//     })),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     sudoMiddleware,
//     async (c) => {
//         try {
//             const { sigle, name, credits, school, area, category } = c.req.valid("json")

//             await c.env.DB.prepare(`
//             INSERT INTO course VALUES (
//             ?,
//             ?,
//             ?,
//             ?,
//             ?,
//             ?
//             )
//             `)
//                 .bind(
//                     sigle,
//                     name,
//                     credits,
//                     school,
//                     area,
//                     category
//                 )
//                 .run()

//             return c.json({
//                 message: "Curso agregado"
//             }, 201)
//         } catch (error) {
//             c.json({
//                 message: error?.toString()
//             }, 500)
//         }
//     }
// )

// export default app