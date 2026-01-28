"use client";

import { useEffect } from "react";

/**
 * Компонент для сигнализации готовности приложения в Base App
 * Использует официальный SDK @coinbase/onchainkit с хуком useMiniKit
 */
export default function MiniKitReady() {
  useEffect(() => {
    // Проверяем, доступен ли MiniKit SDK
    if (typeof window !== "undefined") {
      // Небольшая задержка для полной инициализации
      const timer = setTimeout(() => {
        try {
          // Пытаемся использовать официальный SDK
          import("@coinbase/onchainkit/minikit")
            .then((module) => {
              // Если SDK доступен, используем его API
              // Но так как мы не можем использовать хук здесь напрямую,
              // отправляем событие готовности через postMessage
              // Base App принимает оба формата
              if (window.parent !== window) {
                window.parent.postMessage({ type: "miniapp:ready" }, "*");
                // Повторяем для надёжности
                setTimeout(() => {
                  if (window.parent !== window) {
                    window.parent.postMessage({ type: "miniapp:ready" }, "*");
                  }
                }, 200);
              }
              console.log("MiniKit SDK loaded, ready signal sent");
            })
            .catch((error) => {
              // Если SDK не доступен, используем fallback через postMessage
              console.warn("MiniKit SDK not available, using postMessage fallback:", error);
              if (window.parent !== window) {
                window.parent.postMessage({ type: "miniapp:ready" }, "*");
              }
            });
        } catch (error) {
          console.error("Error initializing MiniKit:", error);
          // Fallback на postMessage
          if (window.parent !== window) {
            window.parent.postMessage({ type: "miniapp:ready" }, "*");
          }
        }
      }, 1000); // Задержка для полной инициализации React компонентов

      return () => clearTimeout(timer);
    }
  }, []);

  return null; // Компонент не рендерит ничего
}
