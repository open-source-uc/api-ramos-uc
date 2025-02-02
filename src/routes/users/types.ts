import { z } from "zod"

const currentYear = new Date().getFullYear();

export const UserAccountUpdateSchema = z.object({
    current_nickname: z.string(),
    nickname: z.string().min(5).max(100, { message: "El apodo no debe exceder los 100 caracteres." }),
    admission_year: z.number().int().refine(
        (val) => val >= currentYear - 12 && val <= currentYear,
        { message: `El año de admisión debe estar entre ${currentYear - 12} y ${currentYear}.` }
    ),
    career_name: z.string()
});

export const UserPasswordUpdateSchema = z.object({
    nickname: z.string().max(100, { message: "El apodo no debe exceder los 100 caracteres." }),
    currentPassword: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
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
    nickname: z.string().min(5).max(100, { message: 'El apodo no debe exceder los 100 caracteres.' }),
    admision_year: z.number().int().refine((val) => val >= currentYear - 12 && val <= currentYear, {
        message: `El año de admisión debe estar entre ${currentYear - 12} y ${currentYear}.`,
    }),
    carrer_name: z.string(),
});

export const UserAccountLoginSchema = z.object({
    email: z.string().email().refine((val) => val.endsWith('.uc.cl') || val.endsWith('@uc.cl'), {
        message: 'El correo electrónico debe pertenecer al dominio uc.cl',
    }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
})