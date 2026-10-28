import { useState, useEffect } from 'react';

/**
 * Anchor date and base for cumulative beneficiary tracking:
 * Anchor Date: 2026-10-28 (Wednesday)
 *
 * Daily progression rule requested by client:
 * - اليوم (2026-10-28): الإجمالي 1,350 (+10 أطفال جدد)
 * - غداً (2026-10-29): الإجمالي 1,360 (+10 أطفال جدد)
 * - بعد غد (2026-10-30): الإجمالي 1,370 (+10 أطفال جدد)
 * - وهكذا يومياً (+10 أطفال إضافيين تراكمياً كل يوم)
 */
export const ANCHOR_DATE = '2026-10-28';
export const INITIAL_BASE_BENEFICIARIES = 1340; // Base before anchor day's 10 additions
export const DAILY_INCREMENT = 10;
export const BASE_BENEFICIARY_CHILDREN = INITIAL_BASE_BENEFICIARIES; // backwards compatibility

export interface DailyChildrenCounterData {
  count: number;                 // Daily children added today: 1 to 10
  baseBeneficiaries: number;     // Cumulative base for the current day (1340 on day 0, 1350 on day 1, 1360 on day 2...)
  totalBeneficiaries: number;    // baseBeneficiaries + count (reaches 1,350 today, 1,360 tomorrow, 1,370 day after...)
  formattedTotal: string;        // Formatted with commas: "1,350", "1,360", "1,370", etc.
  maxToday: number;              // 10
  isWithinHours: boolean;        // true during clinic hours (8:00 AM - 6:00 PM AST)
  progressPercent: number;       // 10% to 100%
  timeRangeTextAr: string;
  timeRangeTextEn: string;
  daysAccumulated: number;       // Number of days passed since anchor date
}

/**
 * Computes calendar days passed since anchor date (2026-10-28).
 * Synchronized with Saudi Arabia timezone (Asia/Riyadh UTC+3) so all visitors
 * see the exact official clinic numbers regardless of their local timezone.
 */
export function getDaysSinceAnchor(now: Date = new Date()): number {
  try {
    const riyadhDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now); // "YYYY-MM-DD"
    
    const [currY, currM, currD] = riyadhDateStr.split('-').map(Number);
    const [ancY, ancM, ancD] = ANCHOR_DATE.split('-').map(Number);
    
    const currUtc = Date.UTC(currY, currM - 1, currD);
    const ancUtc = Date.UTC(ancY, ancM - 1, ancD);
    
    const diffDays = Math.floor((currUtc - ancUtc) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch {
    const anchorMidnight = new Date(2026, 9, 28).getTime();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return Math.max(0, Math.floor((todayMidnight - anchorMidnight) / (1000 * 60 * 60 * 24)));
  }
}

/**
 * Calculates current cumulative children count and daily additions:
 * - Accumulates +10 every passing day (1350 today -> 1360 tomorrow -> 1370 day after...)
 * - Daily additions progress from 1 to 10 between 8:00 AM and 6:00 PM (Asia/Riyadh).
 * - Outside clinic hours (after 6 PM), today's quota is complete (+10).
 */
export function calculateDailyChildrenCount(
  maxPerDay: number = DAILY_INCREMENT, 
  initialBase: number = INITIAL_BASE_BENEFICIARIES
): DailyChildrenCounterData {
  const now = new Date();
  const daysPassed = getDaysSinceAnchor(now);

  // Cumulative base for the current day:
  // Day 0: 1340 (+ up to 10 today = 1350)
  // Day 1: 1340 + (1 * 10) = 1350 (+ up to 10 tomorrow = 1360)
  // Day 2: 1340 + (2 * 10) = 1360 (+ up to 10 day after = 1370)
  // Day N: 1340 + (N * 10)
  const currentDayBase = initialBase + (daysPassed * maxPerDay);

  // Determine current hour and minute in Asia/Riyadh (KSA)
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Riyadh',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(now);

    const h = Number(parts.find(p => p.type === 'hour')?.value);
    const m = Number(parts.find(p => p.type === 'minute')?.value);
    if (!isNaN(h) && !isNaN(m)) {
      currentHour = h;
      currentMinute = m;
    }
  } catch {
    // fallback to device local time if Intl timezone is unavailable
  }

  const currentMinutes = currentHour * 60 + currentMinute;
  const startHour = 8;  // 8:00 AM
  const endHour = 18;   // 6:00 PM (18:00)

  const startMinutes = startHour * 60; // 480 mins
  const endMinutes = endHour * 60;     // 1080 mins
  const totalWindow = endMinutes - startMinutes; // 600 mins

  let count: number;
  let isWithinHours = false;
  let progressPercent = 0;

  if (currentMinutes < startMinutes) {
    // Before 8:00 AM: Start of morning registrations
    count = 1;
    progressPercent = 10;
    isWithinHours = false;
  } else if (currentMinutes >= endMinutes) {
    // After 6:00 PM: Complete daily quota reached (+10 children)
    count = maxPerDay;
    progressPercent = 100;
    isWithinHours = false;
  } else {
    // Between 8:00 AM and 6:00 PM: Increases gradually by 10 children across the period
    const elapsedMinutes = currentMinutes - startMinutes;
    count = Math.min(maxPerDay, Math.max(1, Math.floor((elapsedMinutes / totalWindow) * (maxPerDay - 1)) + 1));
    progressPercent = Math.min(100, Math.round((elapsedMinutes / totalWindow) * 100));
    isWithinHours = true;
  }

  const totalBeneficiaries = currentDayBase + count;
  const formattedTotal = totalBeneficiaries.toLocaleString('en-US');

  return {
    count,
    baseBeneficiaries: currentDayBase,
    totalBeneficiaries,
    formattedTotal,
    maxToday: maxPerDay,
    isWithinHours,
    progressPercent,
    timeRangeTextAr: 'من 8:00 ص إلى 6:00 م (10 أطفال يومياً)',
    timeRangeTextEn: '8:00 AM – 6:00 PM (10 children daily)',
    daysAccumulated: daysPassed
  };
}

/**
 * React Hook that automatically recalculates every minute
 * so the counter and cumulative total remain perfectly in sync.
 */
export function useDailyChildrenCounter(
  maxPerDay: number = DAILY_INCREMENT,
  baseCount: number = INITIAL_BASE_BENEFICIARIES
): DailyChildrenCounterData {
  const [data, setData] = useState<DailyChildrenCounterData>(() => 
    calculateDailyChildrenCount(maxPerDay, baseCount)
  );

  useEffect(() => {
    // Update immediately on mount
    setData(calculateDailyChildrenCount(maxPerDay, baseCount));

    // Update every minute (60,000 ms) so the counter advances smoothly in real-time
    const interval = setInterval(() => {
      setData(calculateDailyChildrenCount(maxPerDay, baseCount));
    }, 60000);

    return () => clearInterval(interval);
  }, [maxPerDay, baseCount]);

  return data;
}
