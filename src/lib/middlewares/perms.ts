import { createMiddleware } from "hono/factory";
import { Bindings } from "../honoBase";
import { TokenPayload } from "./token";

export enum PERMISSIONS {
    SUDO = "SUDO",
    CREATE_EDIT_OWN_REVIEW = "CREATE_EDIT_OWN_REVIEW"
}

export const verifyTokenOnePermision = (permission: PERMISSIONS) => {


    return createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
        try {
            const payload: TokenPayload = c.get("jwtPayload")
            const result = await c.env.DB.prepare(`
            SELECT * FROM userpermission WHERE email_hash = ? AND permission_name = ? LIMIT 1
            `).bind(payload.email_hash, permission).first()

            if (!result)
                return c.json({
                    message: `No tienes el permiso de ${permission}`
                }, 401)
        } catch {
            return c.json({
                message: "Server error"
            }, 500)
        }


        await next()
    })
}