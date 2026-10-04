import { useState, type ChangeEvent } from 'react';
import { BigButton } from '../components/BigButton';
import { Screen } from '../components/Screen';
import { ANSWER } from '../config/copy';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { resizePhoto } from '../lib/image';
import { navigate } from '../lib/router';
import type { SaveAnswer } from './Answer';

type State =
  | { status: 'pick' }
  | { status: 'processing' }
  | { status: 'preview'; blob: Blob }
  | { status: 'saving'; blob: Blob }
  | { status: 'error'; blob?: Blob };

export function PhotoAnswer({ question, onSave }: { question: string; onSave: SaveAnswer }) {
  const [state, setState] = useState<State>({ status: 'pick' });
  const blob = 'blob' in state ? state.blob : null;
  const url = useObjectUrl(blob);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return; // 선택을 취소한 경우 그대로 둡니다.
    setState({ status: 'processing' });
    try {
      setState({ status: 'preview', blob: await resizePhoto(file) });
    } catch {
      setState({ status: 'error' });
    }
  };

  const confirm = async (b: Blob) => {
    setState({ status: 'saving', blob: b });
    const ok = await onSave('photo', b, b.type || 'image/jpeg');
    if (!ok) setState({ status: 'error', blob: b });
  };

  if (state.status === 'preview' || state.status === 'saving') {
    const saving = state.status === 'saving';
    return (
      <Screen
        actions={
          <>
            <BigButton onClick={() => confirm(state.blob)} disabled={saving}>
              {saving ? ANSWER.saving : ANSWER.usePhoto}
            </BigButton>
            <BigButton variant="secondary" onClick={() => setState({ status: 'pick' })} disabled={saving}>
              {ANSWER.repickPhoto}
            </BigButton>
          </>
        }
      >
        <p className="question-box__label">{question}</p>
        {url && <img src={url} alt="고른 사진" className="photo-preview" />}
      </Screen>
    );
  }

  if (state.status === 'error') {
    const retry = state.blob;
    return (
      <Screen
        actions={
          <BigButton onClick={() => (retry ? confirm(retry) : setState({ status: 'pick' }))}>{ANSWER.retry}</BigButton>
        }
      >
        <p className="notice" role="alert">
          {ANSWER.saveFailed}
        </p>
      </Screen>
    );
  }

  const busy = state.status === 'processing';
  return (
    <Screen
      actions={
        <>
          <label className={`btn btn--primary ${busy ? 'is-disabled' : ''}`}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="visually-hidden"
              onChange={onFile}
              disabled={busy}
            />
            <span aria-hidden="true">📷 </span>
            {ANSWER.takePhoto}
          </label>
          <label className={`btn btn--secondary ${busy ? 'is-disabled' : ''}`}>
            <input type="file" accept="image/*" className="visually-hidden" onChange={onFile} disabled={busy} />
            <span aria-hidden="true">🖼️ </span>
            {ANSWER.pickPhoto}
          </label>
          <BigButton variant="quiet" onClick={() => navigate('/answer', { replace: true })}>
            {ANSWER.back}
          </BigButton>
        </>
      }
    >
      <p className="question-box__label">{ANSWER.photo}</p>
      <h1>{question}</h1>
      {busy && <p role="status">{ANSWER.preparingPhoto}</p>}
    </Screen>
  );
}
