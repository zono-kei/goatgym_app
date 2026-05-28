export type Role = 'member' | 'admin';

export type Goal = 'maintain' | 'cut' | 'bulk';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  loginId?: string; // 表示用ログインID
  memberId?: string; // 会員番号
  name: string;
  role: Role;
  email: string;
  weight?: number;
  goal?: Goal;
  targetCalories?: number;
  tickets?: number; // 回数券
  contractPlan?: string; // 契約プラン
  gender?: Gender;
  height?: number; // cm
  age?: number;
  activityLevel?: ActivityLevel;
  rawPassword?: string; // 管理者確認・変更用パスワード
}

export interface Reservation {
  id: string;
  userId: string;
  date: string; // ISO date string
  time: string; // e.g. "10:00"
  status: 'upcoming' | 'completed' | 'cancelled';
  memo?: string;
}

export interface MealRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  foodName: string;
  amount: number; // grams
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WeightRecord {
  id: string;
  userId: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;        // 体脂肪率 (%)
  subcutaneousFatPercentage?: number;// 皮下脂肪率 (%)
  skeletalMuscle?: number;           // 骨格筋
  visceralFatLevel?: number;         // 内臓脂肪レベル
  bodyAge?: number;                  // 体年齢
  basalMetabolicRate?: number;       // 基礎代謝量 (kcal)
}

export interface TrainingRecord {
  id: string;
  userId: string;
  date: string;
  menu: string;
  memo?: string;
}

export interface Food {
  name: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}
