import createHono from "../../../lib/honoBase";
import { zValidator } from '@hono/zod-validator'
import bcrypt from "bcryptjs"
import { env } from 'hono/adapter'
import { sign } from "hono/jwt";
import { sha256 } from "../../../lib/hash";
import { UserAccountCreateSchema, UserAccountLoginSchema } from "../../users/types";
import { createRoute, z } from "@hono/zod-openapi";
import { PERMISSIONS } from "../../../lib/enums";

const app = createHono().openapi(
    createRoute({
        method: 'post',
        path: '/register',
        tags: ['auth'],
        security: [
            {
                osuctoken: []
            }
        ],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: UserAccountCreateSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Usuaro creado exitosamente",
                content: {
                    'application/json': {
                        schema: z.object({
                            nickname: z.string(),
                            token: z.string(),
                        }),
                    },
                },
            },
            409: {
                description: "El email ya esta registrado",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            500: {
                description: "Error interno",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        try {
            const { email, password, nickname, admission_year, career_id } = c.req.valid('json');

            const email_hash = await sha256(email);

            const found = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?")
                .bind(email_hash)
                .first();

            if (found !== null) {
                return c.json(
                    {
                        message: "El email ya esta registrado :c",
                    },
                    409
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const resultUser = await c.env.DB.prepare(
                "INSERT INTO useraccount(email_hash, password, nickname, admission_year, career_id) VALUES (?,?,?,?,?) returning token_version"
            )
                .bind(email_hash, hashedPassword, nickname, admission_year, career_id)
                .first<{
                    token_version: string,
                }>();
            if (!resultUser) {
                return c.json({
                    message: "Error interno",
                }, 500)
            }

            const resultPermission = await c.env.DB.prepare("INSERT INTO userpermission(email_hash, permission_id) VALUES (?,?) returning permission_id")
                .bind(email_hash, PERMISSIONS.CREATE_EDIT_OWN_REVIEW).all<{
                    permission_name: string,
                }>();

            const { SECRET_GLOBAL_KEY } = env(c);
            const token = await sign(
                {
                    email_hash: email_hash,
                    token_version: resultUser.token_version,
                    permissions: resultPermission.results
                },
                SECRET_GLOBAL_KEY,
                "HS256"
            );

            return c.json(
                {
                    nickname: nickname,
                    token,
                },
                201
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.toString() : "Error interno";
            return c.json(
                {
                    message: errorMessage,
                },
                500
            );
        }
    }
).openapi(
    createRoute({
        method: 'post',
        path: '/login',
        tags: ['auth'],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: UserAccountLoginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Usuario logeado exitosamente",
                content: {
                    'application/json': {
                        schema: z.object({
                            nickname: z.string(),
                            token: z.string(),
                        }),
                    },
                },
            },
            401: {
                description: "La contraseña o el correo es incorrecto",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
            500: {
                description: "Error interno",
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
        },
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

            const permissions = await c.env.DB.prepare("SELECT permission_id FROM userpermission WHERE email_hash = ?")
                .bind(email_hash).all<{ permission_id: number }>();

            const { SECRET_GLOBAL_KEY } = env(c);
            const token = await sign(
                {
                    email_hash: email_hash,
                    token_version: found?.token_version,
                    permissions: permissions.results
                },
                SECRET_GLOBAL_KEY,
                "HS256"
            );

            return c.json({
                nickname: found.nickname,
                token,
            }, 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.toString() : "Error interno";
            return c.json({
                message: errorMessage
            }, 500);
        }
    }
);



export default app;