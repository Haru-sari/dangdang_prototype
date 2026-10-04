import { Fragment, useEffect } from 'react';
import { navigate, useRoute } from './lib/router';
import { getConsent, getProfile } from './lib/storage';
import { Album } from './screens/Album';
import { Answer } from './screens/Answer';
import { CardDetail } from './screens/CardDetail';
import { Consent } from './screens/Consent';
import { ConsentDeclined } from './screens/ConsentDeclined';
import { Feed } from './screens/Feed';
import { Home } from './screens/Home';
import { Privacy } from './screens/Privacy';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';

const SETUP_PATHS = ['/', '/profile', '/declined'];

function isConsentPath(path: string): boolean {
  return path === '/declined' || path.startsWith('/consent');
}

/** 첫 실행 분기: 동의 전에는 동의 화면만, 프로필 전에는 프로필 화면만 보여줍니다. */
function redirectFor(path: string): string | null {
  if (getConsent()?.agreed !== true) return isConsentPath(path) ? null : '/consent/1';
  if (!getProfile()) return path === '/profile' ? null : '/profile';
  if (SETUP_PATHS.includes(path) || isConsentPath(path)) return '/home';
  return null;
}

function renderRoute(path: string) {
  const [, first, second] = path.split('/');
  switch (first) {
    case 'consent':
      return <Consent step={Number(second) || 1} />;
    case 'declined':
      return <ConsentDeclined />;
    case 'profile':
      return <Profile />;
    case 'answer':
      return <Answer mode={second === 'photo' || second === 'voice' ? second : 'choose'} />;
    case 'feed':
      return <Feed />;
    case 'album':
      return second ? <CardDetail key={second} id={decodeURIComponent(second)} /> : <Album />;
    case 'settings':
      return <Settings />;
    case 'privacy':
      return <Privacy />;
    default:
      return <Home />;
  }
}

export function App() {
  const path = useRoute();
  const redirect = redirectFor(path);

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true });
  }, [redirect]);

  if (redirect) return null;
  // 경로마다 화면 상태를 새로 시작합니다 (예: /answer → /answer/photo)
  return <Fragment key={path}>{renderRoute(path)}</Fragment>;
}
