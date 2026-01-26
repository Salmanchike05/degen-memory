"use client";

import { ReactNode, useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "@/lib/wagmi";

// Создаем QueryClient внутри компонента для избежания проблем с SSR
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState(() => getConfig());

  useEffect(() => {
    setMounted(true);
    // Обновляем конфиг после монтирования на клиенте
    setConfig(getConfig());
  }, []);

  // На сервере используем SSR конфиг, на клиенте - полный
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted ? children : <div style={{ minHeight: "100vh" }}>{children}</div>}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
