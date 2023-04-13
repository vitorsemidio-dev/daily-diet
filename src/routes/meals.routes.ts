import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isDiet: z.boolean(),
    })

    const { name, description, date, isDiet } = createMealBodySchema.parse(
      req.body,
    )

    const sessionId = req.cookies.sessionId

    const meal = {
      id: randomUUID(),
      name,
      description,
      date,
      is_diet: isDiet,
      user_id: sessionId,
    }

    await knex('meals').insert(meal)

    return reply.status(201).send()
  })
}
