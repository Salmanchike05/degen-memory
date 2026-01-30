"use client";

import { Suspense } from "react";
import MemoryGame from "@/components/MemoryGame";
import WalletConnect from "@/components/WalletConnect";
import Leaderboard from "@/components/Leaderboard";
import ShareResult from "@/components/ShareResult";
import GMCheckIn from "@/components/GMCheckIn";

function HomeContent() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            🧠 <span className="text-purple-500">Degen</span> Memory
          </h1>
          <WalletConnect />
        </div>
        
        <p className="text-center text-gray-400 mb-4">Match crypto tokens to win!</p>
        
        {/* Shared Result Banner */}
        <Suspense fallback={null}>
          <ShareResult />
        </Suspense>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          <Leaderboard />
        </div>

        {/* GM daily check-in */}
        <div className="mb-6">
          <GMCheckIn />
        </div>
        
        <MemoryGame />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">
              🧠 <span className="text-purple-500">Degen</span> Memory
            </h1>
          </div>
          <p className="text-center text-gray-400">Loading...</p>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
