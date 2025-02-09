// import { zValidator } from "@hono/zod-validator";
// import createHono from "../../../lib/honoBase";
// import { z } from "zod";
// import { TokenPayload, verifyTokenMiddleware } from "../../../lib/middlewares/token";
// import { PERMISSIONS, verifyTokenOnePermision } from "../../../lib/middlewares/perms";
// import { HeaderSchema } from "../../../lib/header";

// const app = createHono()

// const sudoMiddleware = verifyTokenOnePermision(PERMISSIONS.SUDO)

// app.put(
//     "/",
//     zValidator(
//         "json",
//         z.object({
//             course_sigle: z.string(),
//             email_hash: z.string(),
//             year: z.number().min(2013),
//             section_number: z.number().min(1).max(100),
//             liked: z.boolean(),
//             comment: z.string().min(10).max(500),
//             estimated_credits: z.number().min(1),
//             status: z.enum(["visible", "hidden"])
//         })
//     ),
//     zValidator(
//         "header",
//         HeaderSchema
//     ),
//     verifyTokenMiddleware,
//     sudoMiddleware,
//     async (c) => {
//         try {
//             const { course_sigle, email_hash, year, section_number, liked, comment, estimated_credits, status } =
//                 c.req.valid("json");

//             const result = await c.env.DB.prepare(
//                 `
//               UPDATE review
//               SET
//                   year = ?,
//                   section_number = ?,
//                   liked = ?,
//                   comment = ?,
//                   estimated_credits = ?,
//                   status = ?
//               WHERE email_hash = ? AND course_sigle = ?
//               `
//             )
//                 .bind(
//                     year,
//                     section_number,
//                     liked,
//                     comment,
//                     estimated_credits,
//                     status,
//                     email_hash,
//                     course_sigle
//                 )
//                 .run();

//             if (result.meta.changes === 0) {
//                 return c.json({ message: "Reseña no encontrada" }, 404);
//             }

//             return c.json({ message: "Reseña actualizada correctamente" }, 200);
//         } catch (error) {
//             return c.json(
//                 {
//                     message: error?.toString(),
//                     error: true,
//                 },
//                 500
//             );
//         }
//     }
// );

// app.delete(
//     "/",
//     zValidator(
//         "json",
//         z.object({
//             course_sigle: z.string(),
//             email_hash: z.string(),
//         })
//     ),
//     zValidator(
//         "header",
//         HeaderSchema
//     ),
//     verifyTokenMiddleware,
//     sudoMiddleware,
//     async (c) => {
//         try {
//             const { course_sigle, email_hash } = c.req.valid("json");

//             const result = await c.env.DB.prepare(
//                 `
//                 DELETE FROM review
//                 WHERE email_hash = ? AND course_sigle = ?
//                 `
//             )
//                 .bind(email_hash, course_sigle)
//                 .run();

//             if (result.meta.changes === 0) {
//                 return c.json({ message: "Reseña no encontrada" }, 404);
//             }

//             return c.json({ message: "Reseña eliminada correctamente" }, 200);
//         } catch (error) {
//             return c.json(
//                 {
//                     message: error?.toString(),
//                     error: true,
//                 },
//                 500
//             );
//         }
//     }
// );
