import createHono from "../../../lib/honoBase";
import bcrypt from "bcryptjs";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { TokenPayload } from "../../../lib/middlewares/token";
import { createRoute, z } from "@hono/zod-openapi";

const app = createHono()
    .openapi(
        createRoute({
            method: "get",
            path: "/",
            tags: ["panel usuario"],
            description: "Obtener datos del usuario, desde la ID del usuario que esta en el token",
            security: [
                {
                    osuctoken: []
                }
            ],
            responses: {
                200: {
                    description: "Datos del usuario",
                    content: {
                        "application/json": {
                            schema: z.object({
                                user: z
                                    .object({
                                        nickname: z.string(),
                                        admission_year: z.number(),
                                        career_id: z.number(),
                                    })
                                    .nullable()
                                    .openapi("PerfilUsuarioSchema"),
                            }),
                        },
                    },
                },
                500: {
                    description: "Error interno",
                    content: {
                        "application/json": {
                            schema: z
                                .object({
                                    message: z.string(),
                                })
                                .openapi("ErrorResponse"),
                        },
                    },
                },
            },
        }),
        async (c) => {
            try {
                const payload: TokenPayload = c.get("jwtPayload");

                const result = await c.env.DB.prepare(
                    `
                SELECT 
                    nickname,
                    admission_year,
                    career_id
                FROM useraccount
                WHERE email_hash = ?
                `
                )
                    .bind(payload.email_hash)
                    .first<{
                        nickname: string;
                        admission_year: number;
                        career_id: number;
                    }>();

                return c.json({ user: result }, 200);
            } catch {
                return c.json({ message: "Server Error" }, 500);
            }
        }
    ).openapi(
        createRoute({
            path: "/",
            method: "put",
            description: "Actualizar datos del usuario que esta en el token",
            tags: ["panel usuario"],
            security: [
                {
                    osuctoken: []
                }
            ],
            request: {
                body: {
                    content: {
                        "application/json": {
                            schema: z.object({
                                nickname: z.string(),
                                admission_year: z.number(),
                                career_id: z.number(),
                            }).openapi("ActualizarPerfilUsuarioSchema"),
                        },
                    },
                }
            },
            responses: {
                200: {
                    description: "Datos actualizados correctamente",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("SuccessResponse"),
                        },
                    },
                },
                400: {
                    description: "Error de validación",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("ErrorResponse"),
                        },
                    },
                },
                500: {
                    description: "Error interno",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("ErrorResponse"),
                        },
                    },
                },
            }
        }),
        async (c) => {
            try {

                const payload: TokenPayload = c.get("jwtPayload")
                const { nickname, admission_year, career_id } = c.req.valid("json")
                const currentYear = new Date().getFullYear()

                if (!(currentYear - 12 <= admission_year))
                    return c.json({
                        message: "El año de admision debe ser mayor o igual a " + (currentYear - 12)
                    }, 400)

                await c.env.DB.prepare(
                    `UPDATE useraccount
                SET
                    nickname = ?,
                    admission_year = ?,
                    career_id = ?
                WHERE email_hash = ?`
                )
                    .bind(nickname, admission_year, career_id, payload.email_hash)
                    .first();

                return c.json(
                    {
                        message: "Datos actualizados correctamente",
                    },
                    200
                );
            } catch {
                return c.json({ message: "Server Error" }, 500);
            }
        }
    ).openapi(
        createRoute({
            path: "/",
            method: "patch",
            description: "Actualizar contraseña del usuario que esta en el token",
            tags: ["panel usuario"],
            security: [
                {
                    osuctoken: []
                }
            ],
            request: {
                body: {
                    content: {
                        "application/json": {
                            schema: z.object({
                                currentPassword: z.string(),
                                newPassword: z.string(),
                            }).openapi("ActualizarContraseñaUsuarioSchema"),
                        },
                    },
                }
            },
            responses: {
                200: {
                    description: "Contraseña actualizada correctamente",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                                token: z.string(),
                            }).openapi("SuccessResponse"),
                        },
                    },
                },
                400: {
                    description: "Error de validación",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("ErrorResponse"),
                        },
                    },
                },
                401: {
                    description: "Contraseña actual incorrecta",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("ErrorResponse"),
                        },
                    },
                },
                404: {
                    description: "Usuario no encontrado",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("NotFoundResponse"),
                        },
                    },
                },
                500: {
                    description: "Error interno",
                    content: {
                        "application/json": {
                            schema: z.object({
                                message: z.string(),
                            }).openapi("ErrorResponse"),
                        },
                    },
                },
            }
        }),
        async (c) => {
            try {
                const { currentPassword, newPassword } = c.req.valid("json");

                const payload: TokenPayload = c.get("jwtPayload");

                const user = await c.env.DB.prepare("SELECT * FROM useraccount WHERE email_hash = ?")
                    .bind(payload.email_hash)
                    .first();

                if (!user)
                    return c.json({ message: "Usuario no encontrado" }, 404);

                const isValid = await bcrypt.compare(currentPassword, user?.password as string);
                if (!isValid)
                    return c.json({ message: "La contraseña actual es incorrecta" }, 401);

                const newHashedPassword = await bcrypt.hash(newPassword, 10);

                /*
                Cuidado al modificar esto pues se actualiza el token el token version y no se hace en un trigger pues pasaria al cambiar el nickname, carrera, etc,
                por lo que debe estar aqui para que se actualize solo cuando se cambie la contraseña
                */
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
        `)
                    .bind(payload.email_hash)
                    .first();

                if (!user2)
                    return c.json({ message: "Error muy extraño", error: true }, 500);

                const permissions = await c.env.DB.prepare("SELECT permission_id FROM userpermission WHERE email_hash = ?")
                    .bind(payload.email_hash).all<{ permission_id: string }>();

                const { SECRET_GLOBAL_KEY } = env(c);
                const token = await sign(
                    {
                        email_hash: payload.email_hash,
                        token_version: user2?.token_version,
                        permissions: permissions
                    },
                    SECRET_GLOBAL_KEY,
                    "HS256"
                );

                return c.json({ message: "Contraseña actualizada correctamente", token }, 200);
            } catch (error) {
                console.log(error)
                return c.json({ message: "Server Error" }, 500);
            }
        }
    );


export default app;