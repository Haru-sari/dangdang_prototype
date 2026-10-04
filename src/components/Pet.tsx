import { PET_IMAGES } from '../config/assets';

export type PetMood = 'idle' | 'eating' | 'welcome' | 'card';

interface Props {
  mood: PetMood;
  size?: 'large' | 'small';
  showBowl?: boolean;
}

/**
 * 강아지 플레이스홀더(SVG + CSS 애니메이션).
 * config/assets.ts의 PET_IMAGES에 경로를 넣으면 그 이미지/GIF로 바뀝니다.
 */
export function Pet({ mood, size = 'large', showBowl = false }: Props) {
  const src = PET_IMAGES[mood];
  const cls = `pet pet--${mood} pet--${size}`;
  if (src) {
    return (
      <div className={cls}>
        <img src={src} alt="강아지" className="pet__img" />
      </div>
    );
  }
  return (
    <div className={cls}>
      <svg viewBox="0 0 200 190" className="pet__svg" role="img" aria-label="강아지">
        <g className="pet-root">
          <ellipse cx="100" cy="172" rx="62" ry="8" fill="#000" opacity="0.08" />
          <g className="pet-tail">
            <path d="M150 116 C 168 110, 176 96, 172 78" stroke="#C98B4E" strokeWidth="12" strokeLinecap="round" fill="none" />
          </g>
          <g className="pet-body">
            <ellipse cx="100" cy="124" rx="56" ry="40" fill="#E2A766" />
            <ellipse cx="100" cy="134" rx="32" ry="24" fill="#F7E1C3" />
            <rect x="62" y="146" width="18" height="24" rx="9" fill="#E2A766" />
            <rect x="120" y="146" width="18" height="24" rx="9" fill="#E2A766" />
          </g>
          <g className="pet-head">
            <ellipse cx="60" cy="62" rx="15" ry="30" fill="#8C5A2B" transform="rotate(18 60 62)" />
            <ellipse cx="140" cy="62" rx="15" ry="30" fill="#8C5A2B" transform="rotate(-18 140 62)" />
            <circle cx="100" cy="70" r="42" fill="#E2A766" />
            <ellipse cx="100" cy="88" rx="22" ry="15" fill="#F7E1C3" />
            <circle cx="84" cy="64" r="5.5" fill="#2B1D14" />
            <circle cx="116" cy="64" r="5.5" fill="#2B1D14" />
            <circle cx="86" cy="62" r="1.8" fill="#fff" />
            <circle cx="118" cy="62" r="1.8" fill="#fff" />
            <ellipse cx="100" cy="80" rx="7" ry="5" fill="#2B1D14" />
            <path d="M92 90 Q 100 97 108 90" stroke="#2B1D14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse className="pet-tongue" cx="100" cy="97" rx="5" ry="6" fill="#E86A6A" />
            <circle cx="74" cy="80" r="5" fill="#F2A0A0" opacity="0.5" />
            <circle cx="126" cy="80" r="5" fill="#F2A0A0" opacity="0.5" />
          </g>
          {showBowl && (
            <g className="pet-bowl">
              <path d="M62 166 L 138 166 L 128 186 L 72 186 Z" fill="#3E6FB0" />
              <ellipse cx="100" cy="166" rx="38" ry="7" fill="#5A88C8" />
              <ellipse className="pet-food" cx="100" cy="163" rx="28" ry="5" fill="#9B6234" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
