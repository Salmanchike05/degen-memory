"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Сигнализирует готовность приложения в Base App / Farcaster через официальный SDK.
 * Без вызова sdk.actions.ready() превью и окно приложения остаются в состоянии "Not Ready".
 * @see https://miniapps.farcaster.xyz/docs/sdk/actions/ready
 */
export default function MiniKitReady() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const callReady = async () => {
      if (cancelled) return;
      try {
        await sdk.actions.ready();
        if (!cancelled) {
          console.log("[MiniKitReady] sdk.actions.ready() called");
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[MiniKitReady] sdk.actions.ready() failed (may be outside iframe):", err);
        }
      }
    };

    // Вызываем ready сразу после монтирования (приложение уже отрендерено)
    callReady();

    // Повторяем с задержкой на случай, если родительский фрейм подписывается позже
    const t1 = setTimeout(callReady, 500);
    const t2 = setTimeout(callReady, 1500);
    const t3 = setTimeout(callReady, 3000);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return null;
}
