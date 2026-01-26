/**
 * Система подсчета очков для таблицы лидеров
 */

type Difficulty = "3x3" | "4x4" | "4x5" | "5x5";

interface ScoreCalculationParams {
  moves: number;
  difficulty: Difficulty;
  timeSeconds?: number; // Опционально, если добавим таймер
}

// Множители сложности
const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  "3x3": 1.0,   // Easy
  "4x4": 1.5,   // Medium
  "4x5": 2.0,   // Hard
  "5x5": 3.0,   // Expert
};

// Базовые очки
const BASE_SCORE = 1000;

/**
 * Рассчитывает очки на основе:
 * - Количества ходов (меньше = больше очков)
 * - Сложности уровня (множитель)
 * - Времени (опционально, бонус за скорость)
 */
export function calculateScore({
  moves,
  difficulty,
  timeSeconds,
}: ScoreCalculationParams): number {
  // Базовые очки уменьшаются за каждый ход
  // Минимум 100 очков даже при большом количестве ходов
  const moveScore = Math.max(100, BASE_SCORE - moves * 10);
  
  // Применяем множитель сложности
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  let finalScore = moveScore * difficultyMultiplier;
  
  // Бонус за скорость (если время указано)
  if (timeSeconds) {
    // Бонус: до 20% за быстрое прохождение
    // Быстрее 60 секунд = максимальный бонус
    const timeBonus = Math.min(1.2, 1 + (60 - timeSeconds) / 300);
    finalScore = finalScore * timeBonus;
  }
  
  // Округляем до целого
  return Math.round(finalScore);
}

/**
 * Форматирует очки для отображения
 */
export function formatScore(score: number): string {
  if (score >= 1000000) {
    return `${(score / 1000000).toFixed(1)}M`;
  }
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}K`;
  }
  return score.toString();
}

/**
 * Получает название уровня сложности
 */
export function getDifficultyName(difficulty: Difficulty): string {
  const names: Record<Difficulty, string> = {
    "3x3": "Easy",
    "4x4": "Medium",
    "4x5": "Hard",
    "5x5": "Expert",
  };
  return names[difficulty];
}
