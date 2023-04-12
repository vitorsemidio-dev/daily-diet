import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function authRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createSessionBodySchema = z.object({
      email: z.string().email().min(3).max(255),
      password: z.string().min(6).max(255),
    })

    const { email, password } = createSessionBodySchema.parse(req.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      return reply.status(404).send()
    }

    if (user.plain_password !== password) {
      return reply.status(401).send()
    }

    const sessionId = user.id

    const sevenDaysInMilliseconds = 1000 * 60 * 60 * 24 * 7

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      maxAge: sevenDaysInMilliseconds,
    })

    return reply.status(201).send()
  })
}
