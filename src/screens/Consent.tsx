import { BigButton } from '../components/BigButton';
import { SafetyNotice } from '../components/SafetyNotice';
import { Screen } from '../components/Screen';
import { CONSENT, CONSENT_STEPS } from '../config/copy';
import { todayKey } from '../lib/date';
import { navigate } from '../lib/router';
import { setConsent, setStartDate } from '../lib/storage';

export function Consent({ step }: { step: number }) {
  const total = CONSENT_STEPS.length;
  const index = Math.min(Math.max(step, 1), total) - 1;
  const current = CONSENT_STEPS[index];
  const isLast = index === total - 1;

  const agree = () => {
    setConsent();
    setStartDate(todayKey());
    // 브라우저가 저장 공간을 임의로 비우지 않도록 요청 (지원하는 브라우저만)
    void navigator.storage?.persist?.().catch(() => undefined);
    navigate('/profile', { replace: true });
  };

  return (
    <Screen
      actions={
        isLast ? (
          <>
            <BigButton onClick={agree}>{CONSENT.agree}</BigButton>
            <BigButton variant="secondary" onClick={() => navigate('/declined')}>
              {CONSENT.decline}
            </BigButton>
          </>
        ) : (
          <BigButton onClick={() => navigate(`/consent/${index + 2}`)}>{CONSENT.next}</BigButton>
        )
      }
    >
      <p className="step-indicator" aria-label={`${total}단계 중 ${index + 1}단계`}>
        {index + 1} / {total}
      </p>
      <h1>{current.title}</h1>
      {current.lines.length > 0 && (
        <ul className="plain-list">
          {current.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {current.safety && <SafetyNotice />}
    </Screen>
  );
}
