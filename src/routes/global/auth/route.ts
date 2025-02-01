import createHono from "../../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod"
import bcrypt from "bcryptjs"
import { env } from 'hono/adapter'
import { sign } from "hono/jwt";

const currentYear = new Date().getFullYear();

const UserAccountCreateSchema = z.object({
    email: z.string().email().refine((val) => val.endsWith('.uc.cl') || val.endsWith('@uc.cl'), {
        message: 'El correo electrónico debe pertenecer al dominio uc.cl',
    }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
        .refine((val) => /[A-Z]/.test(val), {
            message: 'La contraseña debe contener al menos una letra mayúscula.',
        })
        .refine((val) => /[0-9]/.test(val), {
            message: 'La contraseña debe contener al menos un número.',
        }),
    nickname: z.string().max(100, { message: 'El apodo no debe exceder los 100 caracteres.' }),
    admision_year: z.number().int().refine((val) => val >= currentYear - 12 && val <= currentYear, {
        message: `El año de admisión debe estar entre ${currentYear - 12} y ${currentYear}.`,
    }),
    carrer_name: z.string(),
});

const UserAccountLoginSchema = z.object({
    email: z.string().email().refine((val) => val.endsWith('.uc.cl') || val.endsWith('@uc.cl'), {
        message: 'El correo electrónico debe pertenecer al dominio uc.cl',
    }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
})

async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const app = createHono()

app.post(
    '/register',
    zValidator('json', UserAccountCreateSchema, (result, c) => {
        if (!result.success)
            return c.json({ message: result.error.errors[0].message })
    }),
    async (c) => {
        try {
            const { email, password, nickname, admision_year, carrer_name } = c.req.valid('json');

            const hashedEmail = await sha256(email);

            const found = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?").bind(hashedEmail).first()

            if (found !== null)
                return c.json({
                    message: "El email ya esta registrado :c"
                }, 409)

            const hashedPassword = await bcrypt.hash(password, 10)
            const SECRET_USER_KEY = crypto.randomUUID()

            await c.env.DB.prepare("INSERT INTO useraccount VALUES (?,?,?,?,?,?)").bind(hashedEmail, hashedPassword, nickname, admision_year, carrer_name, SECRET_USER_KEY).run()


            const { SECRET_GLOBAL_KEY } = env(c)
            const token = await sign(
                {
                    hashedEmail: hashedEmail,
                },
                SECRET_USER_KEY + SECRET_GLOBAL_KEY
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

            const hashedEmail = await sha256(email);

            const found = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?")
                .bind(hashedEmail)
                .first();

            if (found === null)
                return c.json({ message: "La contraseña o el correo es incorrecto" }, 401);

            const isValidPassword = await bcrypt.compare(password, found?.password);
            if (!isValidPassword)
                return c.json({ message: "La contraseña o el correo es incorrecto" }, 401);

            const { SECRET_GLOBAL_KEY } = env(c);
            const token = await sign(
                {
                    hashedEmail: hashedEmail,
                },
                found.SECRET_USER_KEY + SECRET_GLOBAL_KEY
            );

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