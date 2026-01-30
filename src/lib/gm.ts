/**
 * GM (Good Morning) — ежедневная отметка.
 * Бесплатно: подпись сообщения (без газа).
 * Пропустил день: восстановить за 0.0001 ETH.
 */

const STORAGE_KEY = "degen-memory-gm";

export interface GMCheckIn {
  signature: string;
}

export interface GMRestore {
  txHash: string;
}

export interface GMUserData {
  checkIns: Record<string, GMCheckIn>;
  restores: Record<string, GMRestore>;
}

export type GMStorage = Record<string, GMUserData>;

const RESTORE_AMOUNT_ETH = "0.0001";
const RESTORE_AMOUNT_WEI = BigInt("100000000000000"); // 0.0001 ETH

export { RESTORE_AMOUNT_ETH, RESTORE_AMOUNT_WEI };

/** Сообщение для подписи в указанную дату */
export function getMessageForDate(date: string): string {
  return `GM Degen Memory - ${date}\nSign to check in. No gas, no fee.`;
}

function getStorage(): GMStorage {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as GMStorage;
  } catch {
    return {};
  }
}

function setStorage(data: GMStorage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("GM storage save error:", e);
  }
}

function getUserData(address: string): GMUserData {
  const key = address.toLowerCase();
  const storage = getStorage();
  if (!storage[key]) {
    storage[key] = { checkIns: {}, restores: {} };
  }
  return storage[key];
}

function setUserData(address: string, data: GMUserData): void {
  const key = address.toLowerCase();
  const storage = getStorage();
  storage[key] = data;
  setStorage(storage);
}

/** Все даты, когда пользователь отметился (чек-ин или восстановление) */
export function getActiveDates(address: string): string[] {
  const { checkIns, restores } = getUserData(address);
  const set = new Set<string>([
    ...Object.keys(checkIns),
    ...Object.keys(restores),
  ]);
  return Array.from(set).sort();
}

/** Текущая серия дней подряд (streak) */
export function getStreak(address: string): number {
  const dates = getActiveDates(address);
  if (dates.length === 0) return 0;

  const today = getToday();
  const sorted = [...dates].sort();
  const last = sorted[sorted.length - 1];

  // Если последняя активность не сегодня и не вчера — стрик обнулён
  if (last !== today && last !== getYesterday()) return 0;

  let count = 0;
  let check = today;
  const set = new Set(dates);

  while (set.has(check)) {
    count++;
    check = prevDay(check);
  }

  return count;
}

/** Можно ли сегодня сделать бесплатную отметку */
export function canCheckInToday(address: string): boolean {
  const dates = getActiveDates(address);
  return !dates.includes(getToday());
}

/** Нужно ли восстановить вчера (вчера пропущено, можно заплатить) */
export function canRestoreYesterday(address: string): boolean {
  const yesterday = getYesterday();
  const dates = getActiveDates(address);
  return !dates.includes(yesterday);
}

export function addCheckIn(address: string, date: string, signature: string): void {
  const data = getUserData(address);
  data.checkIns[date] = { signature };
  setUserData(address, data);
}

export function addRestore(address: string, date: string, txHash: string): void {
  const data = getUserData(address);
  data.restores[date] = { txHash };
  setUserData(address, data);
}

/** Сегодня в формате YYYY-MM-DD */
export function getToday(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function prevDay(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
