// import { zValidator } from "@hono/zod-validator";
// import { verifyTokenMiddleware } from "../../../../lib/middlewares/token";
// import { verifyTokenOnePermision } from "../../../../lib/middlewares/perms";
// import createHono from "../../../../lib/honoBase";
// import { HeaderSchema } from "../../../../lib/header";
// import { UserAccountUpdateAdminSchema, UserPasswordUpdateAdminSchema } from "../../../users/types";
// import bcrypt from "bcryptjs"
// import { env } from "hono/adapter";
// import { sign } from "hono/jwt";
// import { z } from "zod";
// import { PERMISSIONS } from "../../../../lib/enums";

// const app = createHono()

// app.get(
//     "/",
//     zValidator("json", z.object({
//         email_hash: z.string()
//     })),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     verifyTokenOnePermision(PERMISSIONS.ADMIN),
//     async (c) => {
//         const { email_hash } = c.req.valid("json");

//         try {
//             const user = await c.env.DB.prepare(`
//                 SELECT 
//                 email_hash,
//                 nickname,
//                 admission_year,
//                 career_name
//                 FROM useraccount
//                 WHERE email_hash = ?`
//             )
//                 .bind(email_hash)
//                 .first();
//             const permissions = await c.env.DB.prepare(`
//                     SELECT 
//                     email_hash,
//                     permission_name
//                     FROM userpermission
//                     WHERE email_hash = ?`
//             )
//                 .bind(email_hash)
//                 .all();

//             return c.json({
//                 user: user,
//                 permissions: permissions
//             }, 200)

//         } catch (error) {
//             return c.json({ message: "Error al actualizar la contraseña", error: true }, 500);
//         }
//     }
// );

// app.put(
//     "/",
//     zValidator("json", UserAccountUpdateAdminSchema, (result, c) => {
//         if (!result.success)
//             return c.json({ message: result.error }, 400);
//         const currentYear = new Date().getFullYear();

//         if (!(currentYear - 12 <= result.data.admission_year))
//             return c.json({
//                 message: "El año de admisión debe ser mayor o igual a " + (currentYear - 12)
//             });
//     }),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     verifyTokenOnePermision(PERMISSIONS.ADMIN),
//     async (c) => {
//         const { email_hash, nickname, admission_year, career_name } = c.req.valid("json");

//         try {
//             const result = await c.env.DB.prepare(
//                 `UPDATE useraccount
//                 SET
//                     nickname = ?,
//                     admission_year = ?,
//                     career_name = ?
//                 WHERE email_hash = ?`
//             )
//                 .bind(nickname, admission_year, career_name, email_hash)
//                 .run();

//             if (result.meta.changes === 0) {
//                 return c.json({ message: "Usuario no encontrado" }, 404);
//             }

//             return c.json({
//                 message: "Datos actualizados correctamente",
//             }, 200);
//         } catch (error) {
//             return c.json({ message: "Error al actualizar los datos del usuario", error: true }, 500);
//         }
//     }
// );

// app.patch(
//     "/",
//     zValidator("json", UserPasswordUpdateAdminSchema, (result, c) => {
//         if (!result.success)
//             return c.json(result.error.errors[0].message, 400);
//     }),
//     zValidator("header", HeaderSchema),
//     verifyTokenMiddleware,
//     verifyTokenOnePermision(PERMISSIONS.ADMIN),
//     async (c) => {
//         const { email_hash, newPassword } = c.req.valid("json");

//         try {
//             const user = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?")
//                 .bind(email_hash)
//                 .first();

//             if (!user)
//                 return c.json({ message: "Usuario no encontrado" }, 404);

//             const newHashedPassword = await bcrypt.hash(newPassword, 10);

//             await c.env.DB.prepare(
//                 `UPDATE useraccount
//                 SET 
//                 password = ?,
//                 token_version = (datetime('now'))
//                 WHERE email_hash = ?`
//             )
//                 .bind(newHashedPassword, email_hash)
//                 .run();

//             const updatedUser = await c.env.DB.prepare(`
//                 SELECT token_version FROM useraccount
//                 WHERE email_hash = ?`
//             ).bind(email_hash).first();

//             if (!updatedUser)
//                 return c.json({ message: "Error al actualizar la contraseña", error: true }, 500);

//             const { SECRET_GLOBAL_KEY } = env(c);
//             const token = await sign(
//                 {
//                     email_hash: email_hash,
//                     token_version: updatedUser?.token_version,
//                 },
//                 SECRET_GLOBAL_KEY,
//                 "HS256"
//             );

//             return c.json({ message: "Contraseña actualizada correctamente", token }, 200);
//         } catch (error) {
//             return c.json({ message: "Error al actualizar la contraseña", error: true }, 500);
//         }
//     }
// );

// export default app