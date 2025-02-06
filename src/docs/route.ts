import { createRoute } from '@hono/zod-openapi'
import { UserAccountCreateSchema } from '../routes/users/types'

export const route = createRoute({
    method: 'get',
    path: '/auth/register',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: UserAccountCreateSchema,
                },
            },
            description: 'Retrieve the user',
        },
    },
})