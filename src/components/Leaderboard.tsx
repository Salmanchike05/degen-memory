"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getLeaderboard, LeaderboardEntry } from "@/lib/leaderboard";
import { formatScore } from "@/lib/score";

export default function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const { address } = useAccount();

  useEffect(() => {
    if (isOpen) {
      setEntries(getLeaderboard());
    }
  }, [isOpen]);

  const getUserRank = () => {
    if (!address) return null;
    const rank = entries.findIndex(
      (e) => e.address.toLowerCase() === address.toLowerCase()
    );
    return rank === -1 ? null : rank + 1;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
      >
        🏆 Leaderboard
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto p-4">
              {entries.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No scores yet!</p>
                  <p className="text-sm mt-2">Be the first to play and set a record!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.slice(0, 20).map((entry, index) => {
                    const isCurrentUser =
                      address &&
                      entry.address.toLowerCase() === address.toLowerCase();
                    
                    return (
                      <div
                        key={`${entry.address}-${entry.timestamp}-${index}`}
                        className={`
                          p-3 rounded-lg flex items-center justify-between
                          ${isCurrentUser
                            ? "bg-purple-900 border-2 border-purple-500"
                            : "bg-gray-800"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-center font-bold">
                            {index === 0 && "🥇"}
                            {index === 1 && "🥈"}
                            {index === 2 && "🥉"}
                            {index > 2 && `#${index + 1}`}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">
                                {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                              </span>
                              {isCurrentUser && (
                                <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {entry.difficulty} • {entry.moves} moves
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-400">
                            {formatScore(entry.score)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User Rank (if connected) */}
            {address && getUserRank() && (
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Your Rank</p>
                  <p className="text-2xl font-bold text-purple-400">
                    #{getUserRank()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
