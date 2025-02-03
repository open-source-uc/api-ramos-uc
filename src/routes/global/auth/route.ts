import createHono from "../../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import bcrypt from "bcryptjs"
import { env } from 'hono/adapter'
import { sign } from "hono/jwt";
import { sha256 } from "../../../lib/hash";
import { UserAccountCreateSchema, UserAccountLoginSchema } from "../../users/types";

const app = createHono()

app.post(
    '/register',
    zValidator('json', UserAccountCreateSchema, (result, c) => {
        if (!result.success)
            return c.json({ message: result.error.errors[0].message }, 400)
        const currentYear = new Date().getFullYear()

        if (!(currentYear - 12 <= result.data.admission_year))
            return c.json({
                message: "El año de admision debe ser mayor a " + (currentYear - 12)
            })
    }),
    async (c) => {
        try {
            const { email, password, nickname, admission_year, carrer_name } = c.req.valid('json');

            const email_hash = await sha256(email);

            const found = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?").bind(email_hash).first()

            if (found !== null)
                return c.json({
                    message: "El email ya esta registrado :c"
                }, 409)

            const hashedPassword = await bcrypt.hash(password, 10)

            const result = await c.env.DB.prepare("INSERT INTO useraccount(email_hash, password, nickname, admission_year, career_name) VALUES (?,?,?,?,?)").bind(email_hash, hashedPassword, nickname, admission_year, carrer_name).first()


            const { SECRET_GLOBAL_KEY } = env(c)
            const token = await sign(
                {
                    email_hash: email_hash,
                    token_version: result?.token_version,
                },
                SECRET_GLOBAL_KEY,
                "HS256"
            )

            return c.json({
                nickname: nickname,
                token
            }, 201)
        } catch (error) {
            return c.json({
                message: error?.toString(), error: true
            }, 500)
        }
    }
);

app.post(
    '/login',
    zValidator('json', UserAccountLoginSchema, (result, c) => {
        if (!result.success)
            return c.json({ message: result.error.errors[0].message });
    }),
    async (c) => {
        try {
            const { email, password } = c.req.valid('json');

            const email_hash = await sha256(email);

            const found = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?")
                .bind(email_hash)
                .first();

            if (found === null)
                return c.json({ message: "La contraseña o el correo es incorrecto" }, 401);

            const isValidPassword = await bcrypt.compare(password, found?.password as string);
            if (!isValidPassword)
                return c.json({ message: "La contraseña o el correo es incorrecto" }, 401);

            const { SECRET_GLOBAL_KEY } = env(c)
            const token = await sign(
                {
                    email_hash: email_hash,
                    token_version: found?.token_version,
                },
                SECRET_GLOBAL_KEY,
                "HS256"
            )

            return c.json({
                nickname: found.nickname,
                token
            }, 200);
        } catch (error) {
            return c.json({
                message: error?.toString(),
                error: true
            }, 500);
        }
    }
);


export default app;