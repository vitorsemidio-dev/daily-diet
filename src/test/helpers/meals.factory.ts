import { randomUUID } from 'crypto'
import { MealTable } from '../../@types/knex'

type OvertypedMealTable = Omit<MealTable, 'is_diet'> & { isDiet: boolean }

export function makeMeal(override: Partial<OvertypedMealTable> = {}) {
  return {
    name: randomUUID(),
    description: randomUUID(),
    date: '2021-01-01T00:00:00.000Z',
    isDiet: true,
    ...override,
  }
}
