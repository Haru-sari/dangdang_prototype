import { useEffect, useState } from 'react';
import { BigButton } from '../components/BigButton';
import { Pet } from '../components/Pet';
import { Screen } from '../components/Screen';
import { HOME } from '../config/copy';
import { useToday } from '../hooks/useToday';
import { getCardByDate, type Card } from '../lib/db';
import { levelFromPoints } from '../lib/level';
import { questionForDate } from '../lib/questions';
import { navigate } from '../lib/router';
import { getLastVisit, getPoints, getProfile, getStartDate, setLastVisit } from '../lib/storage';

type TodayState = { status: 'loading' } | { status: 'ready'; card: Card | null };

export function Home() {
  const today = useToday();
  const name = getProfile()?.name ?? '';
  const level = levelFromPoints(getPoints());
  const question = questionForDate(today, getStartDate() ?? today);
  // 오늘 처음 연 경우 반갑게 달려오는 연출. 며칠 만이어도 같은 따뜻한 인사만 합니다.
  const [welcome] = useState(() => {
    const last = getLastVisit();
    return last !== null && last !== today;
  });
  const [state, setState] = useState<TodayState>({ status: 'loading' });

  useEffect(() => {
    setLastVisit(today);
  }, [today]);

  useEffect(() => {
    let alive = true;
    getCardByDate(today)
      .then((card) => alive && setState({ status: 'ready', card }))
      .catch(() => alive && setState({ status: 'ready', card: null }));
    return () => {
      alive = false;
    };
  }, [today]);

  const card = state.status === 'ready' ? state.card : null;
  const done = card?.fed === true;
  const waitingFeed = card !== null && !card.fed;

  let actions = null;
  if (state.status === 'ready') {
    if (done) {
      actions = <BigButton onClick={() => navigate('/album')}>{HOME.album}</BigButton>;
    } else if (waitingFeed) {
      actions = <BigButton onClick={() => navigate('/feed')}>{HOME.goFeed}</BigButton>;
    } else {
      actions = <BigButton onClick={() => navigate('/answer')}>{HOME.answer}</BigButton>;
    }
  }

  return (
    <Screen
      actions={
        <>
          {actions}
          <div className="nav-row">
            {!done && (
              <BigButton variant="secondary" onClick={() => navigate('/album')}>
                {HOME.album}
              </BigButton>
            )}
            <BigButton variant="secondary" onClick={() => navigate('/settings')}>
              {HOME.settings}
            </BigButton>
          </div>
        </>
      }
    >
      <div className="home-top">
        <p className="greeting">{welcome ? HOME.welcomeBack(name) : HOME.greeting(name)}</p>
        <p className="level-badge">{HOME.level(level)}</p>
      </div>
      <Pet mood={welcome ? 'welcome' : 'idle'} />
      {state.status === 'ready' &&
        (done ? (
          <div className="question-box question-box--done">
            <p className="question-box__title">{HOME.doneTitle}</p>
            <p>{HOME.doneBody}</p>
          </div>
        ) : waitingFeed ? (
          <div className="question-box">
            <p className="question-box__title">{HOME.feedPending}</p>
          </div>
        ) : (
          <div className="question-box">
            <p className="question-box__label">{HOME.questionLabel}</p>
            <p className="question-box__title">{question.text}</p>
          </div>
        ))}
    </Screen>
  );
}
