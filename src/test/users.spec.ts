import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../app'

describe('users', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex:migrate:rollback')
    execSync('npm run knex:migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create new user', async () => {
    const input = {
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    }

    const response = await request(app.server).post('/users').send(input)

    expect(response.status).toBe(201)
  })
})
