import { GetMealsResponse } from "@/schemas/PlannedMeal";
export function getMealSummary(meals: GetMealsResponse[]) {
  const completedEntries = meals.filter((meal) => {
    return meal.players_assigned[0].completions.length > 0;
  });

  const calories = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.kilojoule / 4.184, 0),
  );
  const carbs = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.carbohydrates, 0),
  );
  const protein = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.protein, 0),
  );
  const fats = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.fat, 0),
  );

  const totalCalories = Math.round(
    meals.reduce((acc, meal) => acc + meal.kilojoule / 4.184, 0),
  );
  const totalCarbs = Math.round(
    meals.reduce((acc, meal) => acc + meal.carbohydrates, 0),
  );
  const totalProteins = Math.round(
    meals.reduce((acc, meal) => acc + meal.protein, 0),
  );
  const totalFats = Math.round(meals.reduce((acc, meal) => acc + meal.fat, 0));

  return {
    calories,
    carbs,
    protein,
    fats,
    totalCalories,
    totalCarbs,
    totalProteins,
    totalFats,
  };
}
