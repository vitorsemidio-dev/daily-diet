import { MealTable } from '../@types/knex'

export function calculateLongestDietSequence(meals: MealTable[]): number {
  const uniqueDates = Array.from(
    new Set(
      meals.map((meal) => new Date(meal.date).toISOString().slice(0, 10)),
    ),
  )

  const dietStatusByDay = uniqueDates.map((date) => {
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
    if (status === previousStatus) {
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
