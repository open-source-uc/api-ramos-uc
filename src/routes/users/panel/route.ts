import createHono from "../../../lib/honoBase";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { HeaderSchema } from "../../../lib/header";
import { UserAccountUpdateSchema, UserPasswordUpdateSchema } from "../types";
import { TokenPayload, verifyTokenMiddleware } from "../../../lib/middlewares/token";

const app = createHono();


app.get(
    "/",
    zValidator("header", HeaderSchema, (result, c) => {
        if (!result.success)
            return c.json({
                message: result.error.errors[0].message
            }, 400)
    }),
    verifyTokenMiddleware,
    async (c) => {

        const payload: TokenPayload = c.get("jwtPayload")

        const result = await c.env.DB.prepare(`
            SELECT 
            nickname,
            admission_year,
            career_name
            FROM useraccount
            WHERE email_hash = ?`
        )
            .bind(payload.email_hash)
            .first();


        return c.json({
            user: result
        }, 200)
    })

app.put(
    "/",
    zValidator("json", UserAccountUpdateSchema),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    async (c) => {
        try {

            const payload: TokenPayload = c.get("jwtPayload")
            const { nickname, admission_year, career_name } = c.req.valid("json")

            const result = await c.env.DB.prepare(
                `UPDATE useraccount
                SET
                    nickname = ?,
                    admission_year = ?,
                    career_name = ?
                WHERE email_hash = ?`
            )
                .bind(nickname, admission_year, career_name, payload.email_hash)
                .first();

            return c.json(
                {
                    message: "Datos actualizados correctamente",
                },
                200
            );
        } catch (error) {
            return c.json({ message: error?.toString(), error: true }, 500);
        }
    }
);

app.patch(
    "/",
    zValidator("json", UserPasswordUpdateSchema, (result, c) => {
        if (!result.success)
            return c.json(result.error.errors[0].message, 400)
    }),
    zValidator("header", HeaderSchema),
    verifyTokenMiddleware,
    async (c) => {
        try {
            const { currentPassword, newPassword } = c.req.valid("json");

            const payload: TokenPayload = c.get("jwtPayload")

            const user = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?")
                .bind(payload.email_hash)
                .first();

            if (!user)
                return c.json({ message: "Usuario no encontrado" }, 404)

            const isValid = await bcrypt.compare(currentPassword, user?.password as string);
            if (!isValid)
                return c.json({ message: "La contraseña actual es incorrecta" }, 401);

            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            await c.env.DB.prepare(
                `UPDATE useraccount
                SET 
                password = ?,
                token_version = (datetime('now'))
                WHERE email_hash = ?`
            )
                .bind(newHashedPassword, payload.email_hash)
                .first();

            const user2 = await c.env.DB.prepare(`
                SELECT token_version FROM useraccount
                WHERE email_hash = ?
            `).bind(payload.email_hash).first()

            if (!user2)
                return c.json({ message: "Error muy extraño" }, 500);

            const { SECRET_GLOBAL_KEY } = env(c)
            const token = await sign(
                {
                    email_hash: payload.email_hash,
                    token_version: user2?.token_version,
                },
                SECRET_GLOBAL_KEY,
                "HS256"
            )

            return c.json({ message: "Contraseña actualizada correctamente", token }, 200);
        } catch (error) {
            return c.json({ message: error?.toString(), error: true }, 500);
        }
    }
);

export default app;