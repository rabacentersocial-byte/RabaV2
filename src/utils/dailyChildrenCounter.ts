import { useState, useEffect } from 'react';

/**
 * Base cumulative count of beneficiary children registered in Raba Center
 */
export const BASE_BENEFICIARY_CHILDREN = 1340;

export interface DailyChildrenCounterData {
  count: number;                 // Daily children added today: 1 to 10
  baseBeneficiaries: number;     // 1,340
  totalBeneficiaries: number;    // 1,340 + count (1,341 to 1,350)
  formattedTotal: string;        // "1,341" to "1,350"
  maxToday: number;              // 10
  isWithinHours: boolean;
  progressPercent: number;
  timeRangeTextAr: string;
  timeRangeTextEn: string;
}

/**
 * Calculates current daily children count based on user's local time:
 * Range: 8:00 AM (08:00) to 6:00 PM (18:00)
 * Total duration: 10 hours (600 minutes)
 * Increases by 10 children across the period (approx 1 child every hour).
 * Synchronized with the cumulative beneficiaries base (1,340 + count).
 */
export function calculateDailyChildrenCount(
  maxPerDay: number = 10, 
  baseCount: number = BASE_BENEFICIARY_CHILDREN
): DailyChildrenCounterData {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
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
    // After 6:00 PM: Complete daily quota reached
    count = maxPerDay;
    progressPercent = 100;
    isWithinHours = false;
  } else {
    // Between 8:00 AM and 6:00 PM: Exactly increases by 10 children over the period
    const elapsedMinutes = currentMinutes - startMinutes;
    // Gradual progression: 1 at 8am, 2 at 9am, ..., 10 at 5pm-6pm
    count = Math.min(maxPerDay, Math.max(1, Math.floor((elapsedMinutes / totalWindow) * (maxPerDay - 1)) + 1));
    progressPercent = Math.min(100, Math.round((elapsedMinutes / totalWindow) * 100));
    isWithinHours = true;
  }

  const totalBeneficiaries = baseCount + count;
  const formattedTotal = totalBeneficiaries.toLocaleString('en-US');

  return {
    count,
    baseBeneficiaries: baseCount,
    totalBeneficiaries,
    formattedTotal,
    maxToday: maxPerDay,
    isWithinHours,
    progressPercent,
    timeRangeTextAr: 'من 8:00 ص إلى 6:00 م (10 أطفال يومياً)',
    timeRangeTextEn: '8:00 AM – 6:00 PM (10 children daily)'
  };
}

/**
 * React Hook that automatically recalculates every minute
 * and dispatches/syncs with window events if needed.
 */
export function useDailyChildrenCounter(
  maxPerDay: number = 10,
  baseCount: number = BASE_BENEFICIARY_CHILDREN
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
