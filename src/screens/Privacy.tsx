import { BigButton } from '../components/BigButton';
import { Screen } from '../components/Screen';
import { PRIVACY } from '../config/copy';

export function Privacy() {
  return (
    <Screen
      actions={
        <BigButton variant="secondary" onClick={() => history.back()}>
          {PRIVACY.back}
        </BigButton>
      }
    >
      <h1>{PRIVACY.title}</h1>
      <dl className="privacy">
        {PRIVACY.sections.map((s) => (
          <div key={s.heading} className="privacy__item">
            <dt>{s.heading}</dt>
            <dd>{s.body}</dd>
          </div>
        ))}
      </dl>
    </Screen>
  );
}
