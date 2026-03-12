import { Elysia, t } from 'elysia'

export const app = new Elysia({
    "prefix":"/api"
})
    .get('/', 'Hello from ElysiaJS Backend!')
    .get('/health', () => ({ status: 'ok', timestamp: Date.now() }))
    .get('/message', () => ({ message: 'Hello from ElysiaJS API!' }))
    .post('/echo', ({ body }) => body, {
        body: t.Object({
            message: t.String()
        })
    })
