import { Goal } from '../types';

export const calculatePFC = (targetCalories: number, goal: Goal) => {
  let pRatio, fRatio, cRatio;

  switch (goal) {
    case 'cut':
      pRatio = 0.35;
      fRatio = 0.25;
      cRatio = 0.40;
      break;
    case 'bulk':
      pRatio = 0.25;
      fRatio = 0.20;
      cRatio = 0.55;
      break;
    case 'maintain':
    default:
      pRatio = 0.30;
      fRatio = 0.25;
      cRatio = 0.45;
      break;
  }

  // P: 4 kcal/g, F: 9 kcal/g, C: 4 kcal/g
  const proteinGrams = Math.round((targetCalories * pRatio) / 4);
  const fatGrams = Math.round((targetCalories * fRatio) / 9);
  const carbsGrams = Math.round((targetCalories * cRatio) / 4);

  return {
    protein: proteinGrams,
    fat: fatGrams,
    carbs: carbsGrams,
    pRatio, fRatio, cRatio
  };
};
