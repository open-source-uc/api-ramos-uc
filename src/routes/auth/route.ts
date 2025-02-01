import createHono from "../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod"
import argon2 from "argon2"

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

async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const app = createHono()

app.get("/", (c) => c.json({ message: "hola" }))

app.post(
    '/',
    zValidator('json', UserAccountCreateSchema, (result, c) => {
        if (!result.success)
            return c.json({ message: result.error.errors[0].message })
    }),
    async (c) => {
        const { email, password, nickname, admision_year, carrer_name } = c.req.valid('json');

        const hashedEmail = await sha256(email);
        const hashedPassword = await argon2.hash(password)

        const found = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?").bind(hashedEmail).first()

        if (!found) return c.json({
            message: "El email ya esta registrado :c"
        })

        await c.env.DB.prepare("INSERT INTO useraccount VALUES (?,?,?,?,?)").bind(hashedEmail, hashedPassword, nickname, admision_year, carrer_name)

        return c.json({
            hashedEmail,
            hashedPassword
        })
    }
);

export default app;