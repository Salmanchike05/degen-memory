"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [showMenu, setShowMenu] = useState(false);

  // Обрабатываем ошибки подключения
  useEffect(() => {
    if (error) {
      console.error("Wallet connection error:", error);
      // Не блокируем приложение при ошибке подключения
    }
  }, [error]);

  // В Base App автоматически подключается через farcasterMiniApp connector
  const farcasterConnector = connectors.find(
    (c) => c.id === "farcasterMiniApp"
  );
  const baseAccountConnector = connectors.find((c) => c.id === "baseAccount");

  const handleConnect = () => {
    const connector = farcasterConnector || baseAccountConnector;
    if (connector) {
      connect({ connector });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          {formatAddress(address)}
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <p className="text-xs text-gray-400">Connected</p>
              <p className="text-sm font-mono">{formatAddress(address)}</p>
            </div>
            <button
              onClick={() => {
                disconnect();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-b-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-colors"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
