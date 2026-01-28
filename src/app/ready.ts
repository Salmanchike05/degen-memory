/**
 * Base App Ready Event Handler
 * Отправляет событие готовности приложения для Base App preview
 * 
 * Base App ожидает событие через postMessage с типом "miniapp:ready"
 */

if (typeof window !== "undefined") {
  function sendReadyEvent() {
    try {
      // Отправляем событие через postMessage для iframe (Base App preview)
      // Base App ожидает простой формат: { type: "miniapp:ready" }
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: "miniapp:ready" },
          "*"
        );
        // Повторяем для надёжности
        setTimeout(() => {
          if (window.parent !== window) {
            window.parent.postMessage(
              { type: "miniapp:ready" },
              "*"
            );
          }
        }, 200);
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
    // Задержка для полной инициализации React компонентов
    setTimeout(sendReadyEvent, 1000);
    // Повторяем через дополнительную задержку
    setTimeout(sendReadyEvent, 2000);
  } else {
    window.addEventListener("load", () => {
      setTimeout(sendReadyEvent, 1000);
      setTimeout(sendReadyEvent, 2000);
    });
  }

  // Дополнительно отправляем после полной загрузки всех скриптов
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(sendReadyEvent, 1500);
      setTimeout(sendReadyEvent, 2500);
    });
  }
}
