import { describe, expect, it } from 'vitest';
import { isChallengePlayable } from './equipment';

describe('isChallengePlayable', () => {
  it('allows a challenge that requires no equipment regardless of settings', () => {
    expect(isChallengePlayable({}, { but: false, mur: false })).toBe(true);
  });

  it('allows a challenge whose required equipment is enabled', () => {
    expect(
      isChallengePlayable({ equipment: 'but' }, { but: true, mur: false }),
    ).toBe(true);
  });

  it('blocks a challenge whose required equipment is disabled', () => {
    expect(
      isChallengePlayable({ equipment: 'but' }, { but: false, mur: true }),
    ).toBe(false);
  });

  it('blocks a challenge requiring a wall when the wall is disabled', () => {
    expect(
      isChallengePlayable({ equipment: 'mur' }, { but: true, mur: false }),
    ).toBe(false);
  });
});
