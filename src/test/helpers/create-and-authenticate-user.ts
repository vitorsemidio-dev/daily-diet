import { FastifyInstance } from 'fastify/types/instance'
import request from 'supertest'
import { makeUser } from './users.factory'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const createUserBody = makeUser()
  await request(app.server).post('/users').send(createUserBody)
  const loginResponse = await request(app.server).post('/auth').send({
    email: createUserBody.email,
    password: createUserBody.password,
  })
  const cookies = loginResponse.get('Set-Cookie')

  return {
    cookies,
    user: createUserBody,
  }
}
