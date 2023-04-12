import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3).max(255),
      email: z.string().email().min(3).max(255),
      password: z.string().min(6).max(255),
    })
    const { name, email, password } = createUserBodySchema.parse(req.body)

    const user = {
      id: randomUUID(),
      name,
      email,
      plain_password: password,
    }

    await knex('users').insert(user)

    return reply.status(201).send()
  })
}
