import { useEffect, useState } from 'react';
import { BigButton } from '../components/BigButton';
import { Pet } from '../components/Pet';
import { Screen } from '../components/Screen';
import { ALBUM } from '../config/copy';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { formatDateKey } from '../lib/date';
import { listCards, type Card } from '../lib/db';
import { navigate } from '../lib/router';

function CardAnswerThumb({ card }: { card: Card }) {
  const url = useObjectUrl(card.answerType === 'photo' ? card.answerBlob : null);
  if (card.answerType === 'voice') {
    return (
      <div className="album-card__voice">
        <span aria-hidden="true">🎙️</span>
        <span>{ALBUM.voiceCard}</span>
      </div>
    );
  }
  return url ? <img src={url} alt="" className="album-card__photo" /> : <div className="album-card__photo" />;
}

export function Album() {
  const [cards, setCards] = useState<Card[] | null>(null);

  useEffect(() => {
    let alive = true;
    listCards()
      .then((list) => alive && setCards(list))
      .catch(() => alive && setCards([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Screen
      actions={
        <BigButton variant="secondary" onClick={() => navigate('/home')}>
          {ALBUM.home}
        </BigButton>
      }
    >
      <h1>{ALBUM.title}</h1>
      {cards !== null && cards.length === 0 && <p className="empty-note">{ALBUM.empty}</p>}
      {cards !== null && cards.length > 0 && (
        <ul className="album-list">
          {cards.map((card) => (
            <li key={card.id}>
              <button
                type="button"
                className="album-card"
                onClick={() => navigate(`/album/${encodeURIComponent(card.id)}`)}
              >
                <span className="album-card__date">{formatDateKey(card.date)}</span>
                <span className="album-card__question">{card.questionText}</span>
                <span className="album-card__row">
                  <CardAnswerThumb card={card} />
                  <Pet mood="card" size="small" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}
