// import { zValidator } from "@hono/zod-validator";
// import createHono from "../../../lib/honoBase";
// import { z } from "zod";
// import { verifyTokenMiddleware } from "../../../lib/middlewares/token";
// import { PERMISSIONS, verifyTokenOnePermision } from "../../../lib/middlewares/perms";
// import { HeaderSchema } from "../../../lib/header";

// const app = createHono()

// const sudoMiddleware = verifyTokenOnePermision(PERMISSIONS.SUDO)

// app.get(
//     "/",
//     zValidator("query", z.object({
//         page: z.string().transform((val) => parseInt(val, 10))
//             .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
//             .refine((val) => val >= 0 && val <= 1000, {
//                 message: 'El parámetro "page" debe estar entre 0 y 1000',
//             }).optional(),
//         status: z.enum(["visible", "hidden"]).optional()
//     })),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     sudoMiddleware,
//     async (c) => {

//         const { page, status } = c.req.valid("query")

//         const result = await c.env.DB.prepare(`
//         SELECT 
//             r.course_sigle,
//             r.year,
//             r.section_number,
//             r.liked,
//             r.comment,
//             r.estimated_credits,
//             r.date,
//             ua.nickname,
//             ua.email_hash
//         FROM review AS r
//         JOIN useraccount AS ua 
//             ON r.email_hash = ua.email_hash
//         WHERE 
//             (? IS NULL OR r.status = ?)
//         ORDER BY date
//         LIMIT 50 
//         OFFSET 50 * (?);
//     `).bind(status ?? null, status ?? null, page ?? 0).run()

//         return c.json({ reviews: result.results }, 200)
//     })

// app.get("/course/:sigle",
//     zValidator("param", z.object({
//         sigle: z.string()
//     })),
//     zValidator("query", z.object({
//         page: z.string().transform((val) => parseInt(val, 10))
//             .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
//             .refine((val) => val >= 0 && val <= 1000, {
//                 message: 'El parámetro "page" debe estar entre 0 y 1000',
//             }).optional(),
//         status: z.enum(["visible", "hidden"]).optional()
//     })),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     sudoMiddleware,
//     async (c) => {

//         const { sigle } = c.req.valid("param")
//         const { page, status } = c.req.valid("query")

//         const result = await c.env.DB.prepare(`
//             SELECT 
//                 r.course_sigle,
//                 r.year,
//                 r.section_number,
//                 r.liked,
//                 r.comment,
//                 r.estimated_credits,
//                 r.date,
//                 ua.nickname,
//                 ua.email_hash
//             FROM review AS r
//             JOIN useraccount AS ua 
//                 ON r.email_hash = ua.email_hash
//             WHERE 
//             (? IS NULL OR r.status = ?)
//             AND
//             r.course_sigle = ?
//             LIMIT 50 
//             OFFSET 50 * (?);
//         `).bind(status ?? null, status ?? null, sigle, page ?? 0).run()

//         if (result.meta.rows_read === 0)
//             return c.json({ message: "Not found any review" }, 404)

//         return c.json({ reviews: result.results }, 200)

//     })

// app.get("/user/:nickname",
//     zValidator("param", z.object({
//         nickname: z.string()
//     })),
//     zValidator("query", z.object({
//         page: z.string().transform((val) => parseInt(val, 10))
//             .refine((val) => !isNaN(val), { message: "Valor debe ser un numero valido" })
//             .refine((val) => val >= 0 && val <= 1000, {
//                 message: 'El parámetro "page" debe estar entre 0 y 1000',
//             }).optional(),
//         status: z.enum(["visible", "hidden"]).optional()
//     })),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     sudoMiddleware,
//     async (c) => {

//         const { nickname } = c.req.valid("param")
//         const { page, status } = c.req.valid("query")

//         const result = await c.env.DB.prepare(`
//             SELECT 
//                 r.course_sigle,
//                 r.year,
//                 r.section_number,
//                 r.liked,
//                 r.comment,
//                 r.estimated_credits,
//                 r.date,
//                 ua.nickname,
//                 ua.email_hash
//             FROM review AS r
//             JOIN useraccount AS ua 
//                 ON r.email_hash = ua.email_hash
//             WHERE 
//             (? IS NULL OR r.status = ?)
//             AND
//             ua.nickname = ?
//             LIMIT 50 
//             OFFSET 50 * (?);
//         `).bind(status ?? null, status ?? null, nickname, page ?? 0).run()

//         if (result.meta.rows_read === 0)
//             return c.json({ message: "Not found any review" }, 404)

//         return c.json({ reviews: result.results }, 200)
//     })

// export default app
