import { randomUUID } from 'crypto'

import { UserTable } from '../../@types/knex'

export function makeUser(override: Partial<UserTable> = {}) {
  return {
    name: randomUUID(),
    email: randomUUID() + '@email.com',
    password: randomUUID(),
    ...override,
  }
}
