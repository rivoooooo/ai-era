import { Elysia, t } from 'elysia'
import { getChallengeBySlug } from './lib/db/queries'

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
    .get('/challenges/:slug', async ({ params, query }) => {
        const slug = params.slug
        const lang = query.lang as string || 'en'
        const challenge = await getChallengeBySlug(slug, lang)
        
        if (!challenge) {
            return new Response(JSON.stringify({ error: 'Challenge not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return challenge
    })
