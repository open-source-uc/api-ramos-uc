import { z } from "zod"

export const UserAccountUpdateSchema = z.object({
    current_nickname: z.string(),
    nickname: z.string().min(4).max(100, { message: "El apodo no debe exceder los 100 caracteres." }),
    admission_year: z.number().int(),
    career_name: z.string()
});


export const UserAccountUpdateAdminSchema = z.object({
    current_nickname: z.string(),
    nickname: z.string().min(4).max(100, { message: "El apodo no debe exceder los 100 caracteres." }),
    admission_year: z.number().int(),
    career_name: z.string(),
    email_hash: z.string()
});

export const UserPasswordUpdateSchema = z.object({
    currentPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    newPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .refine((val) => /[A-Z]/.test(val), {
            message: "La contraseña debe contener al menos una letra mayúscula."
        })
        .refine((val) => /[0-9]/.test(val), {
            message: "La contraseña debe contener al menos un número."
        })
});

export const UserPasswordUpdateAdminSchema = z.object({
    email_hash: z.string(),
    newPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .refine((val) => /[A-Z]/.test(val), {
            message: "La contraseña debe contener al menos una letra mayúscula."
        })
        .refine((val) => /[0-9]/.test(val), {
            message: "La contraseña debe contener al menos un número."
        })
});

export const UserAccountCreateSchema = z.object({
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
    nickname: z.string().min(4).max(100, { message: 'El apodo no debe exceder los 100 caracteres.' }),
    admission_year: z.number().int(),
    carrer_name: z.string(),
}).openapi("UserAccountCreateSchema");

export const UserAccountLoginSchema = z.object({
    email: z.string().email().refine((val) => val.endsWith('.uc.cl') || val.endsWith('@uc.cl'), {
        message: 'El correo electrónico debe pertenecer al dominio uc.cl',
    }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
        .refine((val) => /[A-Z]/.test(val), {
            message: 'La contraseña debe contener al menos una letra mayúscula.',
        })
        .refine((val) => /[0-9]/.test(val), {
            message: 'La contraseña debe contener al menos un número.',
        })
}).openapi("UserAccountLoginSchema");