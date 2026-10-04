import { useEffect, useRef, useState } from 'react';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { BigButton } from './BigButton';

interface Props {
  blob: Blob;
  playLabel: string;
  stopLabel: string;
}

/** 큰 재생/멈춤 버튼 하나로 된 음성 재생기 */
export function AudioPlayer({ blob, playLabel, stopLabel }: Props) {
  const url = useObjectUrl(blob);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    } else {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <div className="audio-player">
      {url && (
        <audio
          ref={audioRef}
          src={url}
          preload="auto"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
        />
      )}
      <BigButton variant="secondary" onClick={toggle} disabled={!url} aria-pressed={playing}>
        <span aria-hidden="true">{playing ? '■ ' : '▶ '}</span>
        {playing ? stopLabel : playLabel}
      </BigButton>
    </div>
  );
}
