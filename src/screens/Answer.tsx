import { useEffect, useState } from 'react';
import { BigButton } from '../components/BigButton';
import { Screen } from '../components/Screen';
import { ANSWER } from '../config/copy';
import { todayKey } from '../lib/date';
import { addCard, AlreadyRecordedError, getCardByDate, type AnswerType } from '../lib/db';
import { questionForDate } from '../lib/questions';
import { navigate } from '../lib/router';
import { getStartDate } from '../lib/storage';
import { PhotoAnswer } from './PhotoAnswer';
import { VoiceAnswer } from './VoiceAnswer';

export type AnswerMode = 'choose' | 'photo' | 'voice';

export type SaveAnswer = (type: AnswerType, blob: Blob, mimeType: string) => Promise<boolean>;

export function Answer({ mode }: { mode: AnswerMode }) {
  // 화면에 들어온 날의 질문으로 저장합니다(답하는 중 자정이 지나도 질문과 날짜가 어긋나지 않게).
  const [dateKey] = useState(todayKey);
  const [question] = useState(() => questionForDate(dateKey, getStartDate() ?? dateKey));

  useEffect(() => {
    let alive = true;
    getCardByDate(dateKey)
      .then((card) => {
        if (alive && card) navigate('/home', { replace: true });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [dateKey]);

  /** 저장 성공 시 밥 주기 화면으로 이동. 실패하면 false */
  const save: SaveAnswer = async (type, blob, mimeType) => {
    try {
      await addCard({
        date: dateKey,
        questionId: question.id,
        questionText: question.text,
        answerType: type,
        answerBlob: blob,
        mimeType,
      });
      navigate('/feed', { replace: true });
      return true;
    } catch (e) {
      if (e instanceof AlreadyRecordedError) {
        navigate('/home', { replace: true });
        return true;
      }
      return false;
    }
  };

  if (mode === 'photo') return <PhotoAnswer question={question.text} onSave={save} />;
  if (mode === 'voice') return <VoiceAnswer question={question.text} onSave={save} />;

  return (
    <Screen
      actions={
        <>
          <BigButton onClick={() => navigate('/answer/photo')}>
            <span aria-hidden="true">📷 </span>
            {ANSWER.photo}
          </BigButton>
          <BigButton onClick={() => navigate('/answer/voice')}>
            <span aria-hidden="true">🎙️ </span>
            {ANSWER.voice}
          </BigButton>
          <BigButton variant="quiet" onClick={() => navigate('/home', { replace: true })}>
            {ANSWER.skip}
          </BigButton>
        </>
      }
    >
      <p className="question-box__label">{question.text}</p>
      <h1>{ANSWER.chooseTitle}</h1>
    </Screen>
  );
}
