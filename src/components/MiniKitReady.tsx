"use client";

import { useEffect } from "react";

/**
 * Компонент для сигнализации готовности приложения в Base App
 * Отправляет событие готовности через postMessage
 */
export default function MiniKitReady() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Функция для отправки события готовности
    const sendReadySignal = () => {
      try {
        // Base App ожидает событие через postMessage с типом "miniapp:ready"
        if (window.parent !== window) {
          window.parent.postMessage({ type: "miniapp:ready" }, "*");
        }
        // Также отправляем событие в текущее окно
        window.dispatchEvent(new CustomEvent("miniapp:ready"));
        console.log("Mini app ready signal sent");
      } catch (error) {
        console.error("Error sending ready signal:", error);
      }
    };

    // Отправляем после полной инициализации React компонентов
    const timer1 = setTimeout(sendReadySignal, 1000);
    const timer2 = setTimeout(sendReadySignal, 2000);
    const timer3 = setTimeout(sendReadySignal, 3000);

    // Также отправляем после полной загрузки страницы
    if (document.readyState === "complete") {
      setTimeout(sendReadySignal, 1500);
    } else {
      window.addEventListener("load", () => {
        setTimeout(sendReadySignal, 1500);
      });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return null; // Компонент не рендерит ничего
}
