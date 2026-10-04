import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 화면 아래쪽에 붙는 버튼 영역 */
  actions?: ReactNode;
  className?: string;
}

/** 모바일 폭으로 제한된 한 화면. 위에 내용, 아래에 버튼. */
export function Screen({ children, actions, className }: Props) {
  return (
    <main className={`screen ${className ?? ''}`}>
      <div className="screen__body">{children}</div>
      {actions && <div className="screen__actions">{actions}</div>}
    </main>
  );
}
