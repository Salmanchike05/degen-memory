"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage, useSendTransaction } from "wagmi";
import {
  getToday,
  getMessageForDate,
  getStreak,
  canCheckInToday,
  canRestoreYesterday,
  addCheckIn,
  addRestore,
  RESTORE_AMOUNT_ETH,
  RESTORE_AMOUNT_WEI,
} from "@/lib/gm";
const GM_PAYMENT_RECIPIENT =
  process.env.NEXT_PUBLIC_GM_PAYMENT_RECIPIENT?.trim() || "";

export default function GMCheckIn() {
  const { address, isConnected } = useAccount();
  const [streak, setStreak] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canRestore, setCanRestore] = useState(false);

  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();

  useEffect(() => {
    if (!address) {
      setStreak(0);
      setCanCheckIn(false);
      setCanRestore(false);
      return;
    }
    setStreak(getStreak(address));
    setCanCheckIn(canCheckInToday(address));
    setCanRestore(canRestoreYesterday(address));
  }, [address]);

  const handleCheckIn = async () => {
    if (!address || !canCheckIn) return;
    const today = getToday();
    const message = getMessageForDate(today);
    try {
      const signature = await signMessageAsync({ message });
      addCheckIn(address, today, signature);
      setStreak(getStreak(address));
      setCanCheckIn(false);
      setCanRestore(canRestoreYesterday(address));
    } catch (e) {
      console.error("GM sign error:", e);
    }
  };

  const handleRestore = async () => {
    if (!address || !canRestore || !GM_PAYMENT_RECIPIENT) return;
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    })();
    try {
      const hash = await sendTransactionAsync({
        to: GM_PAYMENT_RECIPIENT as `0x${string}`,
        value: RESTORE_AMOUNT_WEI,
      });
      if (hash) {
        addRestore(address, yesterday, hash);
        setStreak(getStreak(address));
        setCanRestore(false);
      }
    } catch (e) {
      console.error("GM restore payment error:", e);
    }
  };

  if (!isConnected || !address) return null;

  const hasRecipient = GM_PAYMENT_RECIPIENT && GM_PAYMENT_RECIPIENT.length === 42;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold text-purple-300">GM streak</span>
        <span className="text-2xl font-bold tabular-nums">{streak}</span>
      </div>
      <p className="mb-3 text-xs text-gray-400">
        Отмечайся каждый день подписью (бесплатно). Пропустил день — восстанови за {RESTORE_AMOUNT_ETH} ETH.
      </p>
      <div className="flex flex-col gap-2">
        {canCheckIn && (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={isSigning}
            className="w-full rounded-lg bg-purple-600 py-2.5 font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
          >
            {isSigning ? "Подпись…" : "GM — отметить сегодня"}
          </button>
        )}
        {canRestore && hasRecipient && (
          <button
            type="button"
            onClick={handleRestore}
            disabled={isSending}
            className="w-full rounded-lg border border-amber-600 bg-amber-900/40 py-2.5 font-semibold text-amber-200 transition-colors hover:bg-amber-900/60 disabled:opacity-50"
          >
            {isSending ? "Отправка…" : `Восстановить вчера — ${RESTORE_AMOUNT_ETH} ETH`}
          </button>
        )}
        {canRestore && !hasRecipient && (
          <p className="text-xs text-gray-500">
            Восстановление отключено: не задан NEXT_PUBLIC_GM_PAYMENT_RECIPIENT.
          </p>
        )}
        {!canCheckIn && !canRestore && streak > 0 && (
          <p className="text-center text-sm text-gray-400">
            Сегодня уже отмечен. Заходи завтра.
          </p>
        )}
      </div>
    </div>
  );
}
