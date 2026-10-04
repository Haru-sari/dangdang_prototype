import { SAFETY_NOTICE } from '../config/copy';

export function SafetyNotice() {
  return (
    <p className="safety" role="note">
      {SAFETY_NOTICE}
    </p>
  );
}
