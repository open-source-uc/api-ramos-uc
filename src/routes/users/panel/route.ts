import createHono from "../../../lib/honoBase";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { env } from "hono/adapter";
import { sign, verify } from "hono/jwt";
import { HeaderSchema } from "../../../lib/header";
import { UserAccountUpdateSchema, UserPasswordUpdateSchema } from "../types";

const app = createHono();


app.get(
    "/:nickname",
    zValidator("param", z.object({
        nickname: z.string()
    }), (result, c) => {
        if (!result.success)
            return c.json({
                message: result.error.errors[0].message
            }, 400)
    }),
    zValidator("header", HeaderSchema, (result, c) => {
        if (!result.success)
            return c.json({
                message: result.error.errors[0].message
            }, 400)
    }),
    async (c) => {
        const { osuctoken } = c.req.valid("header");
        const { nickname } = c.req.valid("param")
        const user = await c.env.DB.prepare(`SELECT secret_key FROM useraccount WHERE nickname = ?`).bind(nickname).first()

        const { SECRET_GLOBAL_KEY } = env(c);

        if (!user)
            return c.json({ message: "Usuario no encontrado" }, 404)

        const payload = await verify(osuctoken, user.secret_key + SECRET_GLOBAL_KEY, "HS256")

        const result = await c.env.DB.prepare(`
            SELECT 
            nickname,
            admission_year,
            career_name
            FROM useraccount
            WHERE email_hash = ?`
        )
            .bind(payload?.email_hash)
            .first();
        return c.json({
            user: result
        }, 200)
    })

app.put(
    "/",
    zValidator("json", UserAccountUpdateSchema),
    zValidator("header", HeaderSchema),
    async (c) => {
        try {
            const { osuctoken } = c.req.valid("header");
            const { nickname, admission_year, career_name, current_nickname } = c.req.valid("json");
            const { SECRET_GLOBAL_KEY } = env(c);

            const user = await c.env.DB.prepare(`SELECT secret_key FROM useraccount WHERE nickname = ?`).bind(current_nickname).first()

            if (!user)
                return c.json({ message: "Usuario no encontrado" }, 404)

            const payload = await verify(osuctoken, user.secret_key + SECRET_GLOBAL_KEY, "HS256")

            await c.env.DB.prepare(
                `UPDATE useraccount
                SET
                    nickname = ?,
                    admission_year = ?,
                    career_name = ?
                WHERE email_hash = ?`
            )
                .bind(nickname, admission_year, career_name, payload?.email_hash)
                .run();


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
    zValidator("json", UserPasswordUpdateSchema),
    zValidator("header", HeaderSchema),
    async (c) => {
        try {
            const { osuctoken } = c.req.valid("header");
            const { currentPassword, newPassword, nickname } = c.req.valid("json");
            const { SECRET_GLOBAL_KEY } = env(c);

            const user = await c.env.DB.prepare(`SELECT password, secret_key FROM useraccount WHERE nickname = ?`).bind(nickname).first()

            if (!user)
                return c.json("Usuario no encontrado", 404)

            const payload = await verify(osuctoken, user.secret_key + SECRET_GLOBAL_KEY, "HS256")

            const isValid = await bcrypt.compare(currentPassword, user?.password as string);
            if (!isValid)
                return c.json({ message: "La contraseña actual es incorrecta" }, 401);

            const newHashedPassword = await bcrypt.hash(newPassword, 10);
            const SECRET_USER_KEY = crypto.randomUUID()

            await c.env.DB.prepare(
                `UPDATE useraccount
                SET 
                    password = ?,
                    secret_key = ?
                WHERE email_hash = ?`
            )
                .bind(newHashedPassword, SECRET_USER_KEY, payload?.email_hash)
                .run();

            const token = await sign(
                {
                    email_hash: payload?.email_hash,
                },
                SECRET_USER_KEY + SECRET_GLOBAL_KEY,
                "HS256"
            )


            return c.json({ message: "Contraseña actualizada correctamente", token }, 200);
        } catch (error) {
            return c.json({ message: error?.toString(), error: true }, 500);
        }
    }
);

export default app;