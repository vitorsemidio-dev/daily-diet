import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { MealsMapper } from '../mappers/meals.mapper'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', checkSessionIdExists)

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

  app.put('/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isDiet: z.boolean(),
    })

    const { name, description, date, isDiet } = updateMealBodySchema.parse(
      req.body,
    )
    const { id } = paramsSchema.parse(req.params)

    const sessionId = req.cookies.sessionId

    const meal = await knex('meals').where({ id, user_id: sessionId }).first()

    if (!meal) {
      return reply.status(404).send()
    }

    await knex('meals').where({ id, user_id: sessionId }).update({
      name,
      description,
      date,
      is_diet: isDiet,
    })

    return reply.status(204).send()
  })

  app.delete('/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(req.params)

    const sessionId = req.cookies.sessionId

    const meal = await knex('meals').where({ id, user_id: sessionId }).first()

    if (!meal) {
      return reply.status(404).send()
    }

    await knex('meals').where({ id, user_id: sessionId }).delete()

    return reply.status(204).send()
  })

  app.get('/', async (req, reply) => {
    const sessionId = req.cookies.sessionId

    const meals = await knex('meals').where({ user_id: sessionId })

    const mealsMapped = meals.map((meal) => MealsMapper.toView(meal))

    return reply.status(200).send(mealsMapped)
  })

  app.get('/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(req.params)

    const sessionId = req.cookies.sessionId

    const meal = await knex('meals').where({ id, user_id: sessionId }).first()

    if (!meal) {
      return reply.status(404).send()
    }

    const mealMapped = MealsMapper.toView(meal)

    return reply.status(200).send(mealMapped)
  })

  app.get('/metrics', async (req, reply) => {
    const sessionId = req.cookies.sessionId

    const meals = await knex('meals').where({ user_id: sessionId })

    const metrics = {
      total: meals.length,
      diet: meals.filter((meal) => meal.is_diet).length,
      notDiet: meals.filter((meal) => !meal.is_diet).length,
    }

    return reply.status(200).send({
      metrics,
    })
  })
}
