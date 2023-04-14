import { MealTable } from '../@types/knex'

export class MealsMapper {
  static toView(meal: MealTable) {
    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      date: new Date(meal.date),
      isDiet: !!meal.is_diet,
    }
  }
}
