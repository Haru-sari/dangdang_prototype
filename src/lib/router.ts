// 아주 작은 해시 라우터. 휴대폰의 "뒤로가기"가 화면 단위로 동작하게 합니다.
import { useEffect, useState } from 'react';

function currentPath(): string {
  const h = location.hash.replace(/^#/, '');
  return h.startsWith('/') ? h : '/';
}

export function navigate(path: string, opts: { replace?: boolean } = {}): void {
  if (opts.replace) location.replace(`#${path}`);
  else location.hash = path;
}

export function useRoute(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onChange = () => {
      setPath(currentPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}
