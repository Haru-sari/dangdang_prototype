import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_RECORDING_SECONDS } from '../config/constants';
import { canRecordAudio, supportedAudioMimeType } from '../lib/recorder';

export type RecorderState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'recording'; elapsed: number }
  | { status: 'recorded'; blob: Blob; mimeType: string }
  | { status: 'error'; reason: 'denied' | 'failed' };

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({ status: 'idle' });
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const cancelledRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
    else cleanup();
  }, [cleanup]);

  const start = useCallback(async () => {
    if (!canRecordAudio()) {
      setState({ status: 'error', reason: 'denied' });
      return;
    }
    cancelledRef.current = false;
    setState({ status: 'requesting' });
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const name = e instanceof DOMException ? e.name : '';
      const denied = ['NotAllowedError', 'SecurityError', 'NotFoundError', 'NotReadableError'].includes(name);
      setState({ status: 'error', reason: denied ? 'denied' : 'failed' });
      return;
    }
    if (cancelledRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    streamRef.current = stream;

    try {
      const preferred = supportedAudioMimeType();
      const rec = preferred ? new MediaRecorder(stream, { mimeType: preferred }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };
      rec.onstop = () => {
        cleanup();
        recorderRef.current = null;
        if (cancelledRef.current) return;
        const mimeType = (rec.mimeType || preferred || chunks[0]?.type || 'audio/webm').trim();
        const blob = new Blob(chunks, { type: mimeType });
        setState(blob.size > 0 ? { status: 'recorded', blob, mimeType } : { status: 'error', reason: 'failed' });
      };
      rec.onerror = () => {
        cleanup();
        recorderRef.current = null;
        if (!cancelledRef.current) setState({ status: 'error', reason: 'failed' });
      };
      recorderRef.current = rec;
      rec.start();
      startedAtRef.current = Date.now();
      setState({ status: 'recording', elapsed: 0 });
      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startedAtRef.current) / 1000;
        if (elapsed >= MAX_RECORDING_SECONDS) {
          setState({ status: 'recording', elapsed: MAX_RECORDING_SECONDS });
          stop();
        } else {
          setState({ status: 'recording', elapsed });
        }
      }, 250);
    } catch {
      cleanup();
      setState({ status: 'error', reason: 'failed' });
    }
  }, [cleanup, stop]);

  const reset = useCallback(() => {
    cancelledRef.current = true;
    stop();
    setState({ status: 'idle' });
  }, [stop]);

  // 화면을 떠나면 마이크를 반드시 끕니다.
  useEffect(
    () => () => {
      cancelledRef.current = true;
      const rec = recorderRef.current;
      if (rec && rec.state !== 'inactive') rec.stop();
      cleanup();
    },
    [cleanup],
  );

  return { state, start, stop, reset };
}
