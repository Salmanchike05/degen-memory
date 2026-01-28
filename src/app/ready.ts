/**
 * Base App Ready Event Handler
 * Отправляет событие готовности приложения для Base App preview
 */

if (typeof window !== "undefined") {
  function sendReadyEvent() {
    try {
      // Отправляем событие через postMessage для iframe (Base App preview)
      // Base App ожидает простой формат без лишних полей
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "miniapp:ready",
          },
          "*"
        );
      }

      // Также отправляем событие в текущее окно
      window.dispatchEvent(
        new CustomEvent("miniapp:ready", {
          detail: {},
        })
      );

      console.log("Mini app ready event sent");
    } catch (error) {
      console.error("Error sending ready event:", error);
    }
  }

  // Отправляем событие готовности после полной загрузки DOM и всех ресурсов
  if (document.readyState === "complete") {
    // Небольшая задержка для полной инициализации React компонентов
    setTimeout(sendReadyEvent, 500);
  } else {
    window.addEventListener("load", () => {
      setTimeout(sendReadyEvent, 500);
    });
  }

  // Дополнительно отправляем после полной загрузки всех скриптов
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(sendReadyEvent, 1000);
    });
  }
}
