import { Food } from './types';

export const FOOD_DATABASE: Food[] = [
  // 肉類
  { name: '鶏むね肉', protein: 23, fat: 2, carbs: 0, calories: 108 },
  { name: '鶏ささみ', protein: 24, fat: 1, carbs: 0, calories: 105 },
  { name: '鶏もも肉', protein: 19, fat: 5, carbs: 0, calories: 127 },
  { name: '牛もも赤身', protein: 21, fat: 10, carbs: 0, calories: 180 },
  { name: '牛ヒレ肉', protein: 20, fat: 5, carbs: 0, calories: 133 },
  { name: '豚ヒレ肉', protein: 22, fat: 2, carbs: 0, calories: 115 },
  { name: '豚もも肉', protein: 22, fat: 6, carbs: 0, calories: 143 },
  { name: '馬肉', protein: 21, fat: 2, carbs: 0, calories: 110 },
  // 魚類
  { name: '鮭', protein: 22, fat: 4, carbs: 0, calories: 133 },
  { name: 'まぐろ', protein: 26, fat: 1, carbs: 0, calories: 125 },
  { name: 'かつお', protein: 25, fat: 1, carbs: 0, calories: 114 },
  { name: 'さば', protein: 20, fat: 16, carbs: 0, calories: 247 },
  { name: 'たら', protein: 18, fat: 1, carbs: 0, calories: 82 },
  { name: 'えび', protein: 20, fat: 1, carbs: 0, calories: 90 },
  { name: 'いか', protein: 18, fat: 1, carbs: 1, calories: 83 },
  // 卵・乳製品
  { name: '全卵', protein: 12, fat: 10, carbs: 1, calories: 142 },
  { name: '卵白', protein: 11, fat: 0, carbs: 1, calories: 47 },
  { name: 'ギリシャヨーグルト', protein: 10, fat: 0, carbs: 4, calories: 59 },
  { name: 'カッテージチーズ', protein: 13, fat: 4, carbs: 2, calories: 105 },
  { name: '無脂肪ヨーグルト', protein: 4, fat: 0, carbs: 5, calories: 43 },
  // 炭水化物
  { name: '白米', protein: 2.5, fat: 0.3, carbs: 37, calories: 156 },
  { name: '玄米', protein: 2.8, fat: 1, carbs: 35, calories: 152 },
  { name: 'オートミール', protein: 14, fat: 6, carbs: 69, calories: 380 },
  { name: 'さつまいも', protein: 1, fat: 0, carbs: 31, calories: 132 },
  { name: 'じゃがいも', protein: 2, fat: 0, carbs: 17, calories: 76 },
  { name: '全粒粉パン', protein: 13, fat: 4, carbs: 46, calories: 251 },
  { name: 'うどん', protein: 3, fat: 0, carbs: 21, calories: 95 },
  { name: 'そば', protein: 5, fat: 1, carbs: 24, calories: 114 },
  // 豆類・植物性
  { name: '木綿豆腐', protein: 7, fat: 4, carbs: 2, calories: 72 },
  { name: '納豆', protein: 17, fat: 10, carbs: 12, calories: 200 },
  { name: '枝豆', protein: 11, fat: 6, carbs: 9, calories: 135 },
  { name: '豆乳', protein: 4, fat: 2, carbs: 3, calories: 46 },
  // 脂質源
  { name: 'アボカド', protein: 2, fat: 19, carbs: 6, calories: 187 },
  { name: 'アーモンド', protein: 20, fat: 54, carbs: 20, calories: 609 },
  { name: 'くるみ', protein: 15, fat: 69, carbs: 14, calories: 713 },
  { name: 'ピーナッツ', protein: 26, fat: 49, carbs: 16, calories: 585 },
  { name: 'オリーブオイル', protein: 0, fat: 100, carbs: 0, calories: 900 },
  // 野菜
  { name: 'ブロッコリー', protein: 5, fat: 0.5, carbs: 7, calories: 33 },
  { name: 'ほうれん草', protein: 2, fat: 0, carbs: 3, calories: 20 },
  { name: 'キャベツ', protein: 1, fat: 0, carbs: 5, calories: 23 },
  { name: 'トマト', protein: 1, fat: 0, carbs: 4, calories: 20 },
  { name: 'きのこ', protein: 3, fat: 0, carbs: 4, calories: 22 },
  { name: 'レタス', protein: 1, fat: 0, carbs: 2, calories: 12 },
];
