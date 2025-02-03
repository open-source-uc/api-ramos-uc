import { env } from "hono/adapter";
import { verify } from "hono/jwt";
import { Bindings } from "./honoBase";
import { createMiddleware } from "hono/factory";

export interface TokenPayload {
    email_hash: string;
    token_version: string;
}

export const verifyTokenMiddleware = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
    try {
        const osuctoken = c.req.header("osuctoken")
        if (!osuctoken)
            return c.json({
                message: "Invalid token"
            }, 403)

        const { SECRET_GLOBAL_KEY } = env(c);

        const payload = await verify(osuctoken, SECRET_GLOBAL_KEY, "HS256")

        const { email_hash, token_version } = payload

        const user = await c.env.DB.prepare(`
            SELECT * FROM useraccount WHERE email_hash = ?    
        `).bind(email_hash).first()

        if (!user)
            return c.json({
                message: "Invalid token"
            }, 403)

        if (user.token_version !== token_version)
            return c.json({
                message: "Invalid token"
            }, 403)

        c.set("jwtPayload", payload)
    } catch {
        return c.json({
            message: "Invalid token"
        }, 403)
    }


    await next()
})