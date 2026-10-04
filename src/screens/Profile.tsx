import { useState, type FormEvent } from 'react';
import { BigButton } from '../components/BigButton';
import { Pet } from '../components/Pet';
import { Screen } from '../components/Screen';
import { PROFILE } from '../config/copy';
import { navigate } from '../lib/router';
import { setProfile } from '../lib/storage';

export function Profile() {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!trimmed) return;
    setProfile({ name: trimmed });
    navigate('/home', { replace: true });
  };

  return (
    <Screen
      actions={
        <BigButton onClick={() => submit()} disabled={!trimmed}>
          {PROFILE.submit}
        </BigButton>
      }
    >
      <Pet mood="idle" size="small" />
      <h1>{PROFILE.title}</h1>
      <form onSubmit={submit}>
        <label htmlFor="name" className="field-label">
          {PROFILE.hint}
        </label>
        <input
          id="name"
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={PROFILE.placeholder}
          maxLength={20}
          autoComplete="nickname"
          enterKeyHint="done"
        />
      </form>
    </Screen>
  );
}
