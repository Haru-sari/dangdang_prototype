import { useState } from 'react';
import { AudioPlayer } from '../components/AudioPlayer';
import { BigButton } from '../components/BigButton';
import { Screen } from '../components/Screen';
import { MAX_RECORDING_SECONDS } from '../config/constants';
import { ANSWER } from '../config/copy';
import { useRecorder } from '../hooks/useRecorder';
import { formatSeconds } from '../lib/recorder';
import { navigate } from '../lib/router';
import type { SaveAnswer } from './Answer';

export function VoiceAnswer({ question, onSave }: { question: string; onSave: SaveAnswer }) {
  const { state, start, stop, reset } = useRecorder();
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const confirm = async (blob: Blob, mimeType: string) => {
    setSaving(true);
    setSaveFailed(false);
    const ok = await onSave('voice', blob, mimeType);
    if (!ok) {
      setSaving(false);
      setSaveFailed(true);
    }
  };

  if (state.status === 'error' && state.reason === 'denied') {
    return (
      <Screen
        actions={
          <>
            <BigButton onClick={() => navigate('/answer/photo', { replace: true })}>
              {ANSWER.usePhotoInstead}
            </BigButton>
            <BigButton variant="secondary" onClick={() => start()}>
              {ANSWER.retry}
            </BigButton>
          </>
        }
      >
        <p className="notice" role="alert">
          {ANSWER.micDenied}
        </p>
        <ul className="help-list">
          {ANSWER.micHelp.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Screen>
    );
  }

  if (state.status === 'error' || saveFailed) {
    const recorded = state.status === 'recorded' ? state : null;
    return (
      <Screen
        actions={
          <>
            <BigButton
              onClick={() => (recorded ? confirm(recorded.blob, recorded.mimeType) : reset())}
              disabled={saving}
            >
              {ANSWER.retry}
            </BigButton>
            <BigButton variant="secondary" onClick={() => navigate('/answer/photo', { replace: true })}>
              {ANSWER.usePhotoInstead}
            </BigButton>
          </>
        }
      >
        <p className="notice" role="alert">
          {ANSWER.saveFailed}
        </p>
      </Screen>
    );
  }

  if (state.status === 'recorded') {
    return (
      <Screen
        actions={
          <>
            <BigButton onClick={() => confirm(state.blob, state.mimeType)} disabled={saving}>
              {saving ? ANSWER.saving : ANSWER.useVoice}
            </BigButton>
            <BigButton variant="secondary" onClick={reset} disabled={saving}>
              {ANSWER.rerecord}
            </BigButton>
          </>
        }
      >
        <p className="question-box__label">{question}</p>
        <AudioPlayer blob={state.blob} playLabel={ANSWER.listen} stopLabel={ANSWER.stopListening} />
      </Screen>
    );
  }

  if (state.status === 'recording') {
    return (
      <Screen actions={<BigButton variant="danger" onClick={stop} className="btn--huge">{`■ ${ANSWER.stopRecording}`}</BigButton>}>
        <p className="question-box__label">{question}</p>
        <div className="recording" role="status" aria-live="off">
          <span className="recording__dot" aria-hidden="true" />
          <span>{ANSWER.recording}</span>
          <span className="recording__time">
            {formatSeconds(state.elapsed)} / {formatSeconds(MAX_RECORDING_SECONDS)}
          </span>
        </div>
      </Screen>
    );
  }

  const requesting = state.status === 'requesting';
  return (
    <Screen
      actions={
        <>
          <BigButton onClick={() => start()} disabled={requesting} className="btn--huge">
            {requesting ? ANSWER.preparingMic : `● ${ANSWER.startRecording}`}
          </BigButton>
          <BigButton variant="quiet" onClick={() => navigate('/answer', { replace: true })}>
            {ANSWER.back}
          </BigButton>
        </>
      }
    >
      <p className="question-box__label">{ANSWER.voice}</p>
      <h1>{question}</h1>
      <p>{ANSWER.voiceIntro}</p>
      <p className="muted">{ANSWER.voiceLimit(MAX_RECORDING_SECONDS)}</p>
    </Screen>
  );
}
