import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { usersRoutes } from './routes/users.routes'

const app = fastify()

app.register(cookie)
app.register(usersRoutes, {
  prefix: '/users',
})

export { app }
