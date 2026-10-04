import { useEffect, useState } from 'react';
import { todayKey } from '../lib/date';

/** 오늘 날짜(dateKey). 화면에 돌아오거나 자정이 지나면 갱신됩니다. */
export function useToday(): string {
  const [key, setKey] = useState(todayKey);
  useEffect(() => {
    const refresh = () => setKey(todayKey());
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 30_000);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      window.clearInterval(timer);
    };
  }, []);
  return key;
}
