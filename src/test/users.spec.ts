import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../app'
import { makeUser } from './helpers/users.factory'

describe('users', () => {
  beforeAll(async () => {
    await app.ready()
    execSync('npm run knex:migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create new user', async () => {
    const input = makeUser()

    const response = await request(app.server).post('/users').send(input)

    expect(response.status).toBe(201)
  })
})
