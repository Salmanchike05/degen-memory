/**
 * Base App Ready Event Handler
 * Отправляет событие готовности приложения для Base App preview
 */

if (typeof window !== "undefined") {
  // Отправляем событие готовности после загрузки DOM
  if (document.readyState === "complete") {
    sendReadyEvent();
  } else {
    window.addEventListener("load", sendReadyEvent);
  }

  function sendReadyEvent() {
    try {
      // Отправляем событие через postMessage для iframe (Base App preview)
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "miniapp:ready",
            source: "degen-memory",
            timestamp: Date.now(),
          },
          "*"
        );
      }

      // Отправляем событие в текущее окно
      window.dispatchEvent(
        new CustomEvent("miniapp:ready", {
          detail: { timestamp: Date.now() },
        })
      );

      console.log("Mini app ready event sent");
    } catch (error) {
      console.error("Error sending ready event:", error);
    }
  }
}
