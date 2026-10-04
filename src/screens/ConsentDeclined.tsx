import { BigButton } from '../components/BigButton';
import { Screen } from '../components/Screen';
import { CONSENT } from '../config/copy';
import { navigate } from '../lib/router';

export function ConsentDeclined() {
  return (
    <Screen
      className="screen--center"
      actions={
        <BigButton variant="quiet" onClick={() => navigate('/consent/1', { replace: true })}>
          {CONSENT.declinedRestart}
        </BigButton>
      }
    >
      <h1>{CONSENT.declinedTitle}</h1>
      <p>{CONSENT.declinedBody}</p>
    </Screen>
  );
}
