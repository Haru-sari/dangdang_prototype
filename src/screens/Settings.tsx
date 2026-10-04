import { useState } from 'react';
import { BigButton } from '../components/BigButton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SafetyNotice } from '../components/SafetyNotice';
import { Screen } from '../components/Screen';
import { PHONE } from '../config/constants';
import { SETTINGS } from '../config/copy';
import { navigate } from '../lib/router';
import { wipeAllData } from '../lib/wipe';

type WipeState = 'idle' | 'confirm' | 'wiping' | 'failed';

export function Settings() {
  const [wipe, setWipe] = useState<WipeState>('idle');

  const doWipe = async () => {
    setWipe('wiping');
    try {
      await wipeAllData();
      navigate('/consent/1', { replace: true });
    } catch {
      setWipe('failed');
    }
  };

  return (
    <Screen
      actions={
        <BigButton variant="secondary" onClick={() => navigate('/home')}>
          {SETTINGS.home}
        </BigButton>
      }
    >
      <h1>{SETTINGS.title}</h1>
      <section className="settings-section">
        <SafetyNotice />
        <a className="btn btn--primary" href={`tel:${PHONE.counseling}`}>
          <span aria-hidden="true">📞 </span>
          {SETTINGS.call}
        </a>
      </section>
      <section className="settings-section">
        <BigButton variant="secondary" onClick={() => navigate('/privacy')}>
          {SETTINGS.privacy}
        </BigButton>
        <BigButton variant="danger" onClick={() => setWipe('confirm')}>
          {SETTINGS.wipe}
        </BigButton>
        {wipe === 'failed' && (
          <p className="notice" role="alert">
            {SETTINGS.wipeFailed}
          </p>
        )}
      </section>
      {(wipe === 'confirm' || wipe === 'wiping') && (
        <ConfirmDialog
          message={SETTINGS.wipeConfirm}
          confirmLabel={SETTINGS.wipeYes}
          cancelLabel={SETTINGS.wipeNo}
          onConfirm={doWipe}
          onCancel={() => setWipe('idle')}
          busy={wipe === 'wiping'}
        />
      )}
    </Screen>
  );
}
