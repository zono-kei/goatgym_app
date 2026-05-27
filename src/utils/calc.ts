import { User } from '../types';

export function calculateTargetCalories(user: Partial<User>): number | undefined {
  if (!user.weight || !user.height || !user.age || !user.gender || !user.activityLevel) {
    return user.targetCalories;
  }

  let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
  bmr += user.gender === 'male' ? 5 : -161;

  let multiplier = 1.2;
  if (user.activityLevel === 'medium') multiplier = 1.55;
  else if (user.activityLevel === 'high') multiplier = 1.725;

  const tdee = bmr * multiplier;

  let target = tdee;
  if (user.goal === 'cut') target = tdee - 500;
  else if (user.goal === 'bulk') target = tdee + 500;

  return Math.round(target);
}
