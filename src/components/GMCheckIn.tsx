"use client";

import { useState, useEffect, useRef } from "react";
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
  process.env.NEXT_PUBLIC_GM_PAYMENT_RECIPIENT?.trim() ||
  "0x70CD3bB0D2bC142e3392558D59a8070fF04D939a";

export default function GMCheckIn() {
  const { address, isConnected } = useAccount();
  const [streak, setStreak] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [canRestore, setCanRestore] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

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
      setOpen(false);
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
        setOpen(false);
      }
    } catch (e) {
      console.error("GM restore payment error:", e);
    }
  };

  if (!isConnected || !address) return null;

  const hasRecipient = GM_PAYMENT_RECIPIENT && GM_PAYMENT_RECIPIENT.length === 42;
  const showActions = canCheckIn || (canRestore && hasRecipient);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md bg-gray-800 px-2 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-gray-700"
        title="GM streak"
      >
        🔥 GM <span className="tabular-nums">{streak}</span>
      </button>

      {open && showActions && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-lg">
          {canCheckIn && (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={isSigning}
              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSigning ? "Подпись…" : "Отметить сегодня"}
            </button>
          )}
          {canRestore && hasRecipient && (
            <button
              type="button"
              onClick={handleRestore}
              disabled={isSending}
              className="w-full px-3 py-2 text-left text-sm text-amber-200 hover:bg-gray-800 disabled:opacity-50"
            >
              {isSending ? "Отправка…" : `Восстановить — ${RESTORE_AMOUNT_ETH} ETH`}
            </button>
          )}
        </div>
      )}
      {open && !showActions && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-400 shadow-lg">
          Сегодня уже отмечен
        </div>
      )}
    </div>
  );
}
