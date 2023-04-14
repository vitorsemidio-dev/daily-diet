// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

export type UserTable = {
  id: string
  name: string
  email: string
  plain_password: string
}

export type MealTable = {
  id: string
  name: string
  description: string
  date: Date | number
  is_diet: boolean
  user_id: string
}

declare module 'knex/types/tables' {
  export interface Tables {
    users: UserTable
    meals: MealTable
  }
}
