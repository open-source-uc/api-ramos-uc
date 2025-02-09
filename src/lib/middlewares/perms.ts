import { createMiddleware } from "hono/factory";
import { Bindings } from "../honoBase";
import { TokenPayload } from "./token";
import { PERMISSIONS } from "../enums";

export const verifyPermisionMiddleware = (permission: PERMISSIONS) => {

    return createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
        try {
            const payload: TokenPayload = c.get("jwtPayload")

            if (!payload.permissions.includes(permission))
                return c.json({
                    message: "Invalid permission " + permission.valueOf()
                }, 403)

        } catch {
            return c.json({
                message: "Server error"
            }, 500)
        }


        await next()
    })
}