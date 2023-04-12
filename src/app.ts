import cookie from '@fastify/cookie'
import fastify from 'fastify'

const app = fastify()

app.register(cookie)

export { app }
