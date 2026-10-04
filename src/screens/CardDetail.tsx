import { useEffect, useState } from 'react';
import { AudioPlayer } from '../components/AudioPlayer';
import { BigButton } from '../components/BigButton';
import { Pet } from '../components/Pet';
import { Screen } from '../components/Screen';
import { ALBUM } from '../config/copy';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { formatDateKey } from '../lib/date';
import { getCard, type Card } from '../lib/db';
import { navigate } from '../lib/router';

export function CardDetail({ id }: { id: string }) {
  const [card, setCard] = useState<Card | null>(null);
  const url = useObjectUrl(card?.answerType === 'photo' ? card.answerBlob : null);

  useEffect(() => {
    let alive = true;
    getCard(id)
      .then((c) => {
        if (!alive) return;
        if (c) setCard(c);
        else navigate('/album', { replace: true });
      })
      .catch(() => alive && navigate('/album', { replace: true }));
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <Screen
      actions={
        <BigButton variant="secondary" onClick={() => history.back()}>
          {ALBUM.back}
        </BigButton>
      }
    >
      {card && (
        <article className="card-detail">
          <h1 className="card-detail__date">{formatDateKey(card.date, true)}</h1>
          <p className="card-detail__question">{card.questionText}</p>
          {card.answerType === 'photo' ? (
            url && <img src={url} alt="기록한 사진" className="card-detail__photo" />
          ) : (
            <AudioPlayer blob={card.answerBlob} playLabel={ALBUM.play} stopLabel={ALBUM.stop} />
          )}
          <Pet mood="card" size="small" />
        </article>
      )}
    </Screen>
  );
}
