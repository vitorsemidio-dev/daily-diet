import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../app'
import { createAndAuthenticateUser } from './helpers/create-and-authenticate-user'
import { makeMeal } from './helpers/meals.factory'

describe('meals', () => {
  beforeAll(async () => {
    await app.ready()
    execSync('npm run knex:migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /meals', async () => {
    describe('Success', () => {
      let cookies: string[]

      beforeEach(async () => {
        const { cookies: _cookies } = await createAndAuthenticateUser(app)
        cookies = _cookies
      })

      it('should return 200 if session id is valid', async () => {
        const response = await request(app.server)
          .get('/meals')
          .set('Cookie', cookies)

        expect(response.status).toBe(200)
      })

      it('should return empty list if there are no meals', async () => {
        const response = await request(app.server)
          .get('/meals')
          .set('Cookie', cookies)

        expect(response.body).toHaveLength(0)
      })

      it('should return 200 if session id is valid and return meals', async () => {
        const inputMealDiet = makeMeal()
        const inputMealNoDiet = makeMeal({ isDiet: false })

        await request(app.server)
          .post('/meals')
          .set('Cookie', cookies)
          .send(inputMealDiet)
        await request(app.server)
          .post('/meals')
          .set('Cookie', cookies)
          .send(inputMealNoDiet)

        const response = await request(app.server)
          .get('/meals')
          .set('Cookie', cookies)

        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining(inputMealDiet),
            expect.objectContaining(inputMealNoDiet),
          ]),
        )
      })
    })

    describe('Failure', () => {
      it('should return 401 if no session id is provided', async () => {
        const response = await request(app.server).get('/meals')

        expect(response.status).toBe(401)
      })

      it('should return 401 if session id is invalid', async () => {
        const response = await request(app.server)
          .get('/meals')
          .set('Cookie', 'sessionId=invalid')

        expect(response.status).toBe(401)
      })
    })
  })

  describe('GET /meals/:id', async () => {
    it('should return 200 if session id is valid', async () => {
      const { cookies } = await createAndAuthenticateUser(app)

      const input = makeMeal()

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(input)

      const mealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      const response = await request(app.server)
        .get(`/meals/${mealsResponse.body[0].id}`)
        .set('Cookie', cookies)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.objectContaining(input))
    })
  })

  describe('POST /meals', async () => {
    it('should return 201 if session id is valid', async () => {
      const { cookies } = await createAndAuthenticateUser(app)

      const input = makeMeal()

      const response = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(input)

      expect(response.status).toBe(201)
    })
  })

  describe('DELETE /meals/:id', async () => {
    it('should return 204 if session id is valid', async () => {
      const { cookies } = await createAndAuthenticateUser(app)

      const input = makeMeal()

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(input)

      const mealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      const response = await request(app.server)
        .delete(`/meals/${mealsResponse.body[0].id}`)
        .set('Cookie', cookies)

      expect(response.status).toBe(204)
    })
  })

  describe('PUT /meals/:id', async () => {
    it('should return 204 if session id is valid', async () => {
      const { cookies } = await createAndAuthenticateUser(app)

      const input = makeMeal()

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(input)

      const mealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)

      const response = await request(app.server)
        .put(`/meals/${mealsResponse.body[0].id}`)
        .set('Cookie', cookies)
        .send({ name: 'New name' })

      expect(response.status).toBe(204)
    })
  })

  describe('GET /meals/metrics', async () => {
    it('should return 200 if session id is valid', async () => {
      const { cookies } = await createAndAuthenticateUser(app)

      const input = makeMeal()

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(input)

      const response = await request(app.server)
        .get('/meals/metrics')
        .set('Cookie', cookies)

      expect(response.status).toBe(200)
    })

    describe('should return metrics correctly', () => {
      const dates = Array.from({ length: 10 }).map((_, index) => {
        const day = (index + 1).toString().padStart(2, '0')
        return new Date(`2023-01-${day}T00:00:00.000Z`)
      })
      let cookies: string[]
      let meals: any[]

      beforeEach(async () => {
        const { cookies: _cookies } = await createAndAuthenticateUser(app)
        cookies = _cookies

        meals = [
          makeMeal({ isDiet: false, date: dates[0] }),
          makeMeal({ isDiet: false, date: dates[1] }),
          makeMeal({ isDiet: false, date: dates[2] }),
          makeMeal({ isDiet: false, date: dates[3] }),
          makeMeal({ isDiet: false, date: dates[4] }),
          makeMeal({ isDiet: false, date: dates[5] }),
          makeMeal({ isDiet: true, date: dates[5] }),
          makeMeal({ isDiet: true, date: dates[6] }),
          makeMeal({ isDiet: true, date: dates[7] }),
          makeMeal({ isDiet: true, date: dates[8] }),
        ]

        for (const meal of meals) {
          await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send(meal)
        }
      })

      it('should return { total: 1, diet: 1, notDiet: 0, bestSequence: 1 } when user make only 1 meal Diet', async () => {
        const { cookies } = await createAndAuthenticateUser(app)

        const input = makeMeal({ isDiet: true, date: dates[0] })

        await request(app.server)
          .post('/meals')
          .set('Cookie', cookies)
          .send(input)

        const response = await request(app.server)
          .get('/meals/metrics')
          .set('Cookie', cookies)

        expect(response.body.metrics).toEqual(
          expect.objectContaining({
            total: 1,
            diet: 1,
            notDiet: 0,
            bestSequence: 1,
          }),
        )
      })

      it('should return { total: 1, diet: 0, notDiet: 1, bestSequence: 1 } when user make only 1 meal NotDiet', async () => {
        const { cookies } = await createAndAuthenticateUser(app)

        const input = makeMeal({ isDiet: false, date: dates[0] })

        await request(app.server)
          .post('/meals')
          .set('Cookie', cookies)
          .send(input)

        const response = await request(app.server)
          .get('/meals/metrics')
          .set('Cookie', cookies)

        expect(response.body.metrics).toEqual(
          expect.objectContaining({
            total: 1,
            diet: 0,
            notDiet: 1,
            bestSequence: 1,
          }),
        )
      })

      it('should return { bestSequence: 4 } when longest diet sequence is 4', async () => {
        const response = await request(app.server)
          .get('/meals/metrics')
          .set('Cookie', cookies)

        expect(response.body.metrics).toEqual(
          expect.objectContaining({
            bestSequence: 4,
          }),
        )
      })

      it('should return { total: n } with total of meals', async () => {
        const response = await request(app.server)
          .get('/meals/metrics')
          .set('Cookie', cookies)

        expect(response.body.metrics).toEqual(
          expect.objectContaining({
            total: meals.length,
          }),
        )
      })

      it('should return { notDiet: n } with total of meals that is not diet', async () => {
        const response = await request(app.server)
          .get('/meals/metrics')
          .set('Cookie', cookies)

        expect(response.body.metrics).toEqual(
          expect.objectContaining({
            notDiet: meals.filter((meal) => !meal.isDiet).length,
          }),
        )
      })

      it('should return { diet: n } with total of meals that is diet', async () => {
        const response = await request(app.server)
          .get('/meals/metrics')
          .set('Cookie', cookies)

        expect(response.body.metrics).toEqual(
          expect.objectContaining({
            diet: meals.filter((meal) => meal.isDiet).length,
          }),
        )
      })
    })
  })
})
