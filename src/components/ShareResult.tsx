"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Компонент для отображения результатов из шаринга
 * Показывается когда пользователь переходит по ссылке с параметрами score, moves, difficulty
 */
export default function ShareResult() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const moves = searchParams.get("moves");
  const difficulty = searchParams.get("difficulty");

  if (!score || !moves || !difficulty) {
    return null;
  }

  const difficultyNames: Record<string, string> = {
    "3x3": "Easy",
    "4x4": "Medium",
    "4x5": "Hard",
    "5x5": "Expert",
  };

  const difficultyName = difficultyNames[difficulty] || difficulty;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500">
      <div className="text-center">
        <p className="text-sm text-gray-300 mb-2">🎉 Shared Result</p>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-purple-300">
            {parseInt(score).toLocaleString()} points
          </p>
          <p className="text-sm text-gray-400">
            {difficultyName} • {moves} moves
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Can you beat this score? Play now! 🏆
        </p>
      </div>
    </div>
  );
}
