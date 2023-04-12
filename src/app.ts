import cookie from '@fastify/cookie'
import fastify from 'fastify'

import { authRoutes } from './routes/auth.routes'
import { usersRoutes } from './routes/users.routes'

const app = fastify()

app.register(cookie)

app.register(authRoutes, {
  prefix: '/auth',
})
app.register(usersRoutes, {
  prefix: '/users',
})

export { app }
