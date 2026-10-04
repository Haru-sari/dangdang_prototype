import { useEffect, useState } from 'react';
import { BigButton } from '../components/BigButton';
import { Pet } from '../components/Pet';
import { Screen } from '../components/Screen';
import { SpeechBubble } from '../components/SpeechBubble';
import { ANSWER, FEED, HOME } from '../config/copy';
import { todayKey } from '../lib/date';
import { getCardByDate, markFed, type Card } from '../lib/db';
import { levelFromPoints } from '../lib/level';
import { navigate } from '../lib/router';
import { playBark } from '../lib/sound';
import { addPoint, getPoints } from '../lib/storage';

type State =
  | { status: 'loading' }
  | { status: 'ready'; card: Card }
  | { status: 'feeding'; card: Card }
  | { status: 'fed'; bubble: string; level: number; leveledUp: boolean }
  | { status: 'error'; card: Card };

function randomBubble(): string {
  return FEED.bubbles[Math.floor(Math.random() * FEED.bubbles.length)];
}

export function Feed() {
  const [dateKey] = useState(todayKey);
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let alive = true;
    getCardByDate(dateKey)
      .then((card) => {
        if (!alive) return;
        // 오늘 카드가 없거나 이미 밥을 줬다면 홈에서 알맞은 상태를 보여줍니다.
        if (!card || card.fed) navigate('/home', { replace: true });
        else setState({ status: 'ready', card });
      })
      .catch(() => alive && navigate('/home', { replace: true }));
    return () => {
      alive = false;
    };
  }, [dateKey]);

  const feed = async (card: Card) => {
    // 자동재생 정책 때문에 터치 핸들러 안에서 바로 재생합니다.
    playBark();
    setState({ status: 'feeding', card });
    const before = levelFromPoints(getPoints());
    try {
      const first = await markFed(card.id);
      const points = first ? addPoint() : getPoints();
      const level = levelFromPoints(points);
      setState({ status: 'fed', bubble: randomBubble(), level, leveledUp: level > before });
    } catch {
      setState({ status: 'error', card });
    }
  };

  if (state.status === 'loading') return <Screen>{null}</Screen>;

  if (state.status === 'error') {
    return (
      <Screen actions={<BigButton onClick={() => feed(state.card)}>{ANSWER.retry}</BigButton>}>
        <Pet mood="idle" showBowl />
        <p className="notice" role="alert">
          {ANSWER.saveFailed}
        </p>
      </Screen>
    );
  }

  if (state.status === 'fed') {
    return (
      <Screen
        actions={
          <>
            <BigButton onClick={() => navigate('/album', { replace: true })}>{FEED.album}</BigButton>
            <BigButton variant="secondary" onClick={() => navigate('/home', { replace: true })}>
              {FEED.home}
            </BigButton>
          </>
        }
      >
        <SpeechBubble text={state.bubble} />
        <Pet mood="eating" showBowl />
        <p className={`level-badge ${state.leveledUp ? 'level-badge--up' : ''}`} role="status">
          {state.leveledUp ? FEED.levelUp(state.level) : HOME.level(state.level)}
        </p>
        <p className="saved-note">{FEED.saved}</p>
      </Screen>
    );
  }

  const feeding = state.status === 'feeding';
  return (
    <Screen
      actions={
        <BigButton onClick={() => feed(state.card)} disabled={feeding} className="btn--huge">
          <span aria-hidden="true">🍚 </span>
          {FEED.feed}
        </BigButton>
      }
    >
      <h1>{FEED.arrived}</h1>
      <Pet mood={feeding ? 'eating' : 'idle'} showBowl />
    </Screen>
  );
}
