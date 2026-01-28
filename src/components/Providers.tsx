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

    // Отправляем событие готовности для Base App после полной инициализации
    if (typeof window !== "undefined") {
      // Функция для отправки события готовности
      const sendReadySignal = () => {
        try {
          // Base App ожидает событие через postMessage с типом "miniapp:ready"
          if (window.parent !== window) {
            // Отправляем несколько раз для надёжности
            window.parent.postMessage({ type: "miniapp:ready" }, "*");
            // Повторяем через небольшую задержку
            setTimeout(() => {
              window.parent.postMessage({ type: "miniapp:ready" }, "*");
            }, 100);
          }
          // Также отправляем событие в текущее окно
          window.dispatchEvent(new CustomEvent("miniapp:ready"));
        } catch (error) {
          console.error("Error sending ready event:", error);
        }
      };

      // Отправляем после полной инициализации React компонентов
      setTimeout(sendReadySignal, 1500);
      
      // Дополнительно отправляем после полной загрузки страницы
      if (document.readyState === "complete") {
        setTimeout(sendReadySignal, 2000);
      } else {
        window.addEventListener("load", () => {
          setTimeout(sendReadySignal, 2000);
        });
      }
    }
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
