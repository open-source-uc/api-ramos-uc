import { createMiddleware } from "hono/factory";
import { Bindings } from "../honoBase";
import { TokenPayload } from "./token";
import { PERMISSIONS } from "../enums";

export const verifyPermisionMiddleware = (permission: PERMISSIONS) => {

    return createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
        try {
            const payload: TokenPayload = c.get("jwtPayload")

            let hasAutorization = false
            for (const perm of payload.permissions) {
                if (perm.permission_id === permission.valueOf()) {
                    hasAutorization = true
                    break
                }
            }
            if (!hasAutorization)
                return c.json({
                    message: "No autorizado, falta permiso: " + permission.valueOf()
                }, 403)

        } catch {
            return c.json({
                message: "Server error"
            }, 500)
        }


        await next()
    })
}