import { MealTable } from '../@types/knex'
import { longestSequenceOfDays } from './longestSequenceOfDays'

function filterDietMeals(meals: MealTable[]): Date[] {
  return meals.filter((meal) => meal.is_diet).map((meal) => new Date(meal.date))
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function getDietStatusByDay(meals: MealTable[], dates: Date[]): boolean[] {
  return dates.map((date) => {
    const mealsOfDay = meals.filter((meal) => {
      const mealDate = new Date(meal.date)
      return isSameDay(mealDate, date)
    })
    return mealsOfDay.some((meal) => meal.is_diet)
  })
}

function calculateLongestSequence(statuses: boolean[]): number {
  let longestSequence = 0
  let currentSequence = 0
  let previousStatus: boolean | null = null

  statuses.forEach((status) => {
    if (status && status === previousStatus) {
      currentSequence += 1
    } else {
      longestSequence = Math.max(longestSequence, currentSequence)
      currentSequence = 1
    }
    previousStatus = status
  })

  return Math.max(longestSequence, currentSequence)
}

export function calculateLongestDietSequence(meals: MealTable[]): number {
  const dietMeals = filterDietMeals(meals)
  const longestSequenceOfDaysWithDiet = longestSequenceOfDays(dietMeals)
  const dietStatusByDay = getDietStatusByDay(
    meals,
    longestSequenceOfDaysWithDiet,
  )
  const longestSequence = calculateLongestSequence(dietStatusByDay)
  return longestSequence
}
