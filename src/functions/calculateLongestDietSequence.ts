import { MealTable } from '../@types/knex'
import { longestSequenceOfDays } from './longestSequenceOfDays'

export function calculateLongestDietSequence(meals: MealTable[]): number {
  const longestSequenceOfDaysWithDiet = longestSequenceOfDays(
    meals.filter((x) => x.is_diet).map((meal) => new Date(meal.date)),
  ).map((date) => date.toISOString().slice(0, 10))

  const dietStatusByDay = longestSequenceOfDaysWithDiet.map((date) => {
    const mealsOfDay = meals.filter(
      (meal) => new Date(meal.date).toISOString().slice(0, 10) === date,
    )

    const isDietOfDay = mealsOfDay.some((meal) => meal.is_diet)

    return isDietOfDay
  })

  let longestSequence = 0
  let currentSequence = 0
  let previousStatus: boolean | null = null

  dietStatusByDay.forEach((status) => {
    if (status && status === previousStatus) {
      currentSequence += 1
    } else {
      longestSequence = Math.max(longestSequence, currentSequence)
      currentSequence = 1
    }
    previousStatus = status
  })

  longestSequence = Math.max(longestSequence, currentSequence)

  return longestSequence
}
