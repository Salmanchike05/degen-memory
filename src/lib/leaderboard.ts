/**
 * Управление таблицей лидеров
 * Использует localStorage для хранения (можно заменить на API)
 */

export interface LeaderboardEntry {
  address: string; // Адрес кошелька
  score: number;
  moves: number;
  difficulty: string;
  timestamp: number;
  displayName?: string; // Опциональное имя
}

const LEADERBOARD_KEY = "degen-memory-leaderboard";
const MAX_ENTRIES = 100; // Максимум записей в таблице

/**
 * Получает все записи из таблицы лидеров
 */
export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    
    const entries: LeaderboardEntry[] = JSON.parse(data);
    // Сортируем по очкам (от большего к меньшему)
    return entries.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Error reading leaderboard:", error);
    return [];
  }
}

/**
 * Добавляет новую запись в таблицу лидеров
 */
export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, "timestamp">): void {
  if (typeof window === "undefined") return;
  
  try {
    const entries = getLeaderboard();
    
    // Добавляем новую запись с timestamp
    const newEntry: LeaderboardEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    
    entries.push(newEntry);
    
    // Сортируем и ограничиваем количество
    entries.sort((a, b) => b.score - a.score);
    const limited = entries.slice(0, MAX_ENTRIES);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Error saving leaderboard entry:", error);
  }
}

/**
 * Получает лучший результат пользователя
 */
export function getBestScore(address: string): LeaderboardEntry | null {
  const entries = getLeaderboard();
  const userEntries = entries.filter((e) => e.address.toLowerCase() === address.toLowerCase());
  
  if (userEntries.length === 0) return null;
  
  // Возвращаем лучший результат
  return userEntries.sort((a, b) => b.score - a.score)[0];
}

/**
 * Получает позицию пользователя в таблице лидеров
 */
export function getUserRank(address: string): number {
  const entries = getLeaderboard();
  const sorted = entries.sort((a, b) => b.score - a.score);
  
  const index = sorted.findIndex(
    (e) => e.address.toLowerCase() === address.toLowerCase()
  );
  
  return index === -1 ? 0 : index + 1;
}

/**
 * Очищает таблицу лидеров (для тестирования)
 */
export function clearLeaderboard(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEADERBOARD_KEY);
}
