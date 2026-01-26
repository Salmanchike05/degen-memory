/**
 * Функции для шаринга результатов игры
 */

export interface ShareData {
  score: number;
  moves: number;
  difficulty: string;
  address?: string;
}

/**
 * Генерирует текст для шаринга
 */
export function generateShareText(data: ShareData): string {
  const difficultyNames: Record<string, string> = {
    "3x3": "Easy",
    "4x4": "Medium",
    "4x5": "Hard",
    "5x5": "Expert",
  };

  const difficultyName = difficultyNames[data.difficulty] || data.difficulty;
  
  return `🧠 Just scored ${data.score.toLocaleString()} points in Degen Memory! 🎉

Level: ${difficultyName}
Moves: ${data.moves}

Can you beat my score? 🏆

Play now:`;
}

/**
 * Генерирует URL для шаринга с параметрами
 */
export function generateShareUrl(data: ShareData): string {
  const baseUrl = 
    process.env.NEXT_PUBLIC_URL || 
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  
  const params = new URLSearchParams({
    score: data.score.toString(),
    moves: data.moves.toString(),
    difficulty: data.difficulty,
  });
  
  if (data.address) {
    params.append("address", data.address);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Пытается использовать нативный Web Share API
 */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.share) {
    return false;
  }

  try {
    const shareText = generateShareText(data);
    const shareUrl = generateShareUrl(data);

    await navigator.share({
      title: "Degen Memory - My Score",
      text: shareText,
      url: shareUrl,
    });

    return true;
  } catch (error) {
    // Пользователь отменил шаринг или произошла ошибка
    if ((error as Error).name !== "AbortError") {
      console.error("Error sharing:", error);
    }
    return false;
  }
}

/**
 * Копирует ссылку в буфер обмена
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

/**
 * Генерирует полный текст для копирования (текст + ссылка)
 */
export function generateFullShareText(data: ShareData): string {
  const text = generateShareText(data);
  const url = generateShareUrl(data);
  return `${text} ${url}`;
}

/**
 * Генерирует URL для шаринга в X.com (Twitter)
 */
export function generateTwitterShareUrl(data: ShareData): string {
  const text = generateShareText(data);
  const url = generateShareUrl(data);
  const fullText = `${text} ${url}`;
  
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
}

/**
 * Генерирует URL для шаринга в Farcaster/Warpcast
 */
export function generateFarcasterShareUrl(data: ShareData): string {
  const text = generateShareText(data);
  const url = generateShareUrl(data);
  const fullText = `${text} ${url}`;
  
  // Warpcast share URL
  return `https://warpcast.com/~/compose?text=${encodeURIComponent(fullText)}`;
}

/**
 * Открывает шаринг в X.com в новом окне
 */
export function shareToTwitter(data: ShareData): void {
  const url = generateTwitterShareUrl(data);
  window.open(url, "_blank", "width=550,height=420");
}

/**
 * Открывает шаринг в Farcaster/Warpcast в новом окне
 */
export function shareToFarcaster(data: ShareData): void {
  const url = generateFarcasterShareUrl(data);
  window.open(url, "_blank", "width=550,height=600");
}
