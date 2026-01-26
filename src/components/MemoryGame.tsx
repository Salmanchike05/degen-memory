"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { calculateScore } from "@/lib/score";
import { addLeaderboardEntry } from "@/lib/leaderboard";
import { 
  shareNative, 
  copyToClipboard, 
  generateFullShareText,
  shareToTwitter,
  shareToFarcaster 
} from "@/lib/share";

// Crypto token images - расширенный список для всех уровней
const TOKENS = [
  { id: 1, name: "ETH", image: "/images/eth.png" },
  { id: 2, name: "BTC", image: "/images/btc.png" },
  { id: 3, name: "BASE", image: "/images/base.png" },
  { id: 4, name: "DEGEN", image: "/images/degen.png" },
  { id: 5, name: "USDC", image: "/images/usdc.png" },
  { id: 6, name: "USDT", image: "/images/usdt.png" },
  { id: 7, name: "SOL", image: "/images/sol.png" },
  { id: 8, name: "ARB", image: "/images/arb.png" },
  { id: 9, name: "OP", image: "/images/op.png" },
  { id: 10, name: "BNB", image: "/images/bnb.png" },
  { id: 11, name: "AAVE", image: "/images/aave.png" },
  { id: 12, name: "UNI", image: "/images/uni.png" },
];

type Difficulty = "3x3" | "4x4" | "4x5" | "5x5";

interface DifficultyConfig {
  rows: number;
  cols: number;
  pairs: number;
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  "3x3": { rows: 3, cols: 3, pairs: 4 }, // 8 карточек + 1 пустая
  "4x4": { rows: 4, cols: 4, pairs: 8 }, // 16 карточек
  "4x5": { rows: 4, cols: 5, pairs: 10 }, // 20 карточек
  "5x5": { rows: 5, cols: 5, pairs: 12 }, // 24 карточки + 1 пустая
};

interface Card {
  id: number;
  tokenId: number | null; // null для пустых карточек
  isFlipped: boolean;
  isMatched: boolean;
  isEmpty?: boolean; // флаг для пустых карточек
}

export default function MemoryGame() {
  const { address } = useAccount();
  const [difficulty, setDifficulty] = useState<Difficulty>("3x3");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const config = DIFFICULTIES[difficulty];

  // Initialize game when difficulty changes
  useEffect(() => {
    if (!showLevelSelect) {
      startNewGame();
    }
  }, [difficulty, showLevelSelect]);

  const startNewGame = () => {
    const pairsNeeded = config.pairs;
    const selectedTokens = TOKENS.slice(0, pairsNeeded);
    const totalCells = config.rows * config.cols;
    const totalCards = pairsNeeded * 2;
    const emptyCells = totalCells - totalCards;

    // Create pairs of cards
    const cardPairs: Card[] = [];
    selectedTokens.forEach((token, index) => {
      cardPairs.push(
        { id: index * 2, tokenId: token.id, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, tokenId: token.id, isFlipped: false, isMatched: false }
      );
    });

    // Add empty cards if needed (for 3x3 and 5x5 levels)
    for (let i = 0; i < emptyCells; i++) {
      cardPairs.push({
        id: totalCards + i,
        tokenId: null,
        isFlipped: false,
        isMatched: false,
        isEmpty: true,
      });
    }

    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || card.isEmpty) return;

    if (flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      setTimeout(() => {
        checkMatch(newFlippedCards, updatedCards);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const checkMatch = (flipped: number[], currentCards: Card[]) => {
    const [firstId, secondId] = flipped;
    const firstCard = currentCards.find((c) => c.id === firstId);
    const secondCard = currentCards.find((c) => c.id === secondId);

    if (firstCard && secondCard && firstCard.tokenId === secondCard.tokenId) {
      // Match found
      const updatedCards = currentCards.map((c) =>
        c.id === firstId || c.id === secondId
          ? { ...c, isMatched: true, isFlipped: true }
          : c
      );
      setCards(updatedCards);
      setMatches((prev) => prev + 1);

      // Check if game is won
      if (matches + 1 === config.pairs) {
        setTimeout(() => {
          // Рассчитываем очки
          const score = calculateScore({
            moves: moves + 1, // +1 потому что это текущий ход
            difficulty,
          });
          setFinalScore(score);
          setGameWon(true);
          
          // Сохраняем результат в таблицу лидеров, если кошелек подключен
          if (address) {
            addLeaderboardEntry({
              address,
              score,
              moves: moves + 1,
              difficulty,
            });
          }
        }, 500);
      }
    } else {
      // No match - flip cards back
      const updatedCards = currentCards.map((c) =>
        flipped.includes(c.id) ? { ...c, isFlipped: false } : c
      );
      setCards(updatedCards);
    }

    setFlippedCards([]);
  };

  const selectDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setShowLevelSelect(false);
  };

  const backToLevelSelect = () => {
    setShowLevelSelect(true);
    setCards([]);
    setGameWon(false);
    setShareSuccess(false);
  };

  const handleShare = async () => {
    if (!finalScore) return;

    const shareData = {
      score: finalScore,
      moves,
      difficulty,
      address: address || undefined,
    };

    // Пытаемся использовать нативный шаринг
    const shared = await shareNative(shareData);
    
    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
      return;
    }

    // Если нативный шаринг недоступен, копируем в буфер
    const fullText = generateFullShareText(shareData);
    const copied = await copyToClipboard(fullText);
    
    if (copied) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  if (showLevelSelect) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => selectDifficulty("3x3")}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
          >
            <div className="text-xl font-bold">🌟 Easy</div>
          </button>
          <button
            onClick={() => selectDifficulty("4x4")}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
          >
            <div className="text-xl font-bold">🔥 Medium</div>
          </button>
          <button
            onClick={() => selectDifficulty("4x5")}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
          >
            <div className="text-xl font-bold">⚡ Hard</div>
          </button>
          <button
            onClick={() => selectDifficulty("5x5")}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-center"
          >
            <div className="text-xl font-bold">👑 Expert</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Game Stats */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{moves}</div>
          <div className="text-xs text-gray-400">Moves</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{matches} / {config.pairs}</div>
          <div className="text-xs text-gray-400">Matches</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={backToLevelSelect}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Levels
          </button>
          <button
            onClick={startNewGame}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Game Won Modal */}
      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg text-center max-w-sm mx-4">
            <h2 className="text-3xl font-bold mb-4">🎉 You Won!</h2>
            <p className="text-gray-300 mb-2">
              Level: {difficulty}
            </p>
            <p className="text-gray-300 mb-2">
              Completed in {moves} moves!
            </p>
            {finalScore && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Your Score</p>
                <p className="text-3xl font-bold text-purple-400">
                  {finalScore.toLocaleString()}
                </p>
                {address && (
                  <p className="text-xs text-green-400 mt-2">
                    ✓ Saved to leaderboard!
                  </p>
                )}
                {!address && (
                  <p className="text-xs text-yellow-400 mt-2">
                    Connect wallet to save your score
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-400 mb-1">Share your victory:</p>
              
              {/* Social Share Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (finalScore) {
                      shareToTwitter({
                        score: finalScore,
                        moves,
                        difficulty,
                        address: address || undefined,
                      });
                    }
                  }}
                  className="px-4 py-2 bg-black hover:bg-gray-800 border border-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>𝕏</span>
                  <span className="text-sm">X.com</span>
                </button>
                
                <button
                  onClick={() => {
                    if (finalScore) {
                      shareToFarcaster({
                        score: finalScore,
                        moves,
                        difficulty,
                        address: address || undefined,
                      });
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔷</span>
                  <span className="text-sm">Farcaster</span>
                </button>
              </div>
              
              {/* Copy Link Button */}
              <button
                onClick={handleShare}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {shareSuccess ? (
                  <>
                    <span>✓</span>
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              
              <div className="flex gap-3 justify-center pt-2 border-t border-gray-700">
                <button
                  onClick={backToLevelSelect}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  New Level
                </button>
                <button
                  onClick={startNewGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => {
          // Пустая карточка
          if (card.isEmpty) {
            return (
              <div
                key={card.id}
                className="aspect-square rounded-lg bg-gray-900 opacity-30"
              />
            );
          }

          const token = TOKENS.find((t) => t.id === card.tokenId);
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg cursor-pointer transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? "bg-gray-800"
                  : "bg-gray-700 hover:bg-gray-600"
                }
                ${card.isMatched ? "opacity-50" : ""}
                ${isProcessing && !card.isMatched ? "pointer-events-none" : ""}
                flex items-center justify-center
              `}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="text-center">
                  {token && (
                    <>
                      <img
                        src={token.image}
                        alt={token.name}
                        className="w-10 h-10 mx-auto mb-1"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="text-xs font-semibold">{token.name}</div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-xl">?</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
