import { env } from "hono/adapter";
import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { JWTPayload } from "hono/utils/jwt/types";
import { Bindings } from "../honoBase";

export interface TokenPayload extends JWTPayload {
    email_hash: string;
    token_version: string;
}

export const verifyTokenMiddleware = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
    try {
        const osuctoken = c.req.header("authorization")?.substring("Bearer ".length)

        if (!osuctoken)
            return c.json({
                message: "Invalid token"
            }, 403)

        const { SECRET_GLOBAL_KEY } = env(c);


        const payload: TokenPayload = (await verify(osuctoken, SECRET_GLOBAL_KEY, "HS256")) as unknown as TokenPayload

        const user = await c.env.DB.prepare(`
            SELECT * FROM useraccount WHERE email_hash = ?    
        `).bind(payload.email_hash).first()

        if (!user)
            return c.json({
                message: "Invalid token"
            }, 403)


        if (user.token_version !== payload.token_version)
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