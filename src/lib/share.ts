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
 * Генерирует изображение с результатом игры для шаринга
 */
export async function generateResultImage(data: ShareData): Promise<File | null> {
  if (typeof window === "undefined") return null;

  const difficultyNames: Record<string, string> = {
    "3x3": "Easy",
    "4x4": "Medium",
    "4x5": "Hard",
    "5x5": "Expert",
  };

  const difficultyName = difficultyNames[data.difficulty] || data.difficulty;

  // Размеры изображения
  const width = 1200;
  const height = 630; // Стандартный размер для OG изображений

  // Создаем canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Градиентный фон
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1a0033");
  gradient.addColorStop(0.5, "#2d1b4e");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Добавляем декоративные элементы
  ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.3, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.7, 200, 0, Math.PI * 2);
  ctx.fill();

  // Заголовок
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("🧠 Degen Memory", width / 2, 80);

  // Подзаголовок
  ctx.fillStyle = "#a78bfa";
  ctx.font = "36px Arial, sans-serif";
  ctx.fillText("Match crypto tokens to win!", width / 2, 170);

  // Результат
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 120px Arial, sans-serif";
  ctx.fillText(data.score.toLocaleString(), width / 2, 250);

  // Подпись к очкам
  ctx.fillStyle = "#9ca3af";
  ctx.font = "32px Arial, sans-serif";
  ctx.fillText("points", width / 2, 380);

  // Детали игры
  ctx.fillStyle = "#d1d5db";
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText(`Level: ${difficultyName}`, width / 2, 450);
  ctx.fillText(`Moves: ${data.moves}`, width / 2, 490);

  // Призыв к действию
  ctx.fillStyle = "#a78bfa";
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillText("Can you beat this score? 🏆", width / 2, 560);

  // Конвертируем canvas в blob и затем в File
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "degen-memory-result.png", {
            type: "image/png",
          });
          resolve(file);
        } else {
          resolve(null);
        }
      },
      "image/png",
      0.95
    );
  });
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
    
    // Генерируем изображение с результатом
    const imageFile = await generateResultImage(data);

    // Подготавливаем данные для шаринга
    const sharePayload: {
      title: string;
      text: string;
      url: string;
      files?: File[];
    } = {
      title: "Degen Memory - My Score",
      text: shareText,
      url: shareUrl,
    };

    // Если есть поддержка файлов и изображение сгенерировано, добавляем его
    if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      sharePayload.files = [imageFile];
      await navigator.share(sharePayload);
    } else {
      // Fallback на обычный шаринг без файла
      await navigator.share(sharePayload);
    }

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

/**
 * Скачивает изображение с результатом
 */
export async function downloadResultImage(data: ShareData): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const imageFile = await generateResultImage(data);
    if (!imageFile) return false;

    // Создаем ссылку для скачивания
    const url = URL.createObjectURL(imageFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `degen-memory-${data.score}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Освобождаем память
    setTimeout(() => URL.revokeObjectURL(url), 100);

    return true;
  } catch (error) {
    console.error("Error downloading image:", error);
    return false;
  }
}
