import { describe, expect, it } from 'vitest';
import { pickChallenge, resolveRound, shuffle } from './game';
import type { Challenge } from './hooks/use-challenges';

const challenge = (id: string, minPlayers: number): Challenge => ({
  id,
  name: id,
  description: '',
  minPlayers,
});

describe('shuffle', () => {
  it('returns the same elements', () => {
    const players = ['Alice', 'Bob', 'Charlie'];
    expect(shuffle(players).sort()).toEqual([...players].sort());
  });

  it('returns the same number of elements', () => {
    const players = ['Alice', 'Bob', 'Charlie'];
    expect(shuffle(players)).toHaveLength(players.length);
  });

  it('never produces duplicates', () => {
    const players = ['Alice', 'Bob', 'Charlie', 'Dave'];
    const result = shuffle(players);
    expect(new Set(result).size).toBe(result.length);
  });

  it('does not mutate the original array', () => {
    const players = ['Alice', 'Bob'];
    const copy = [...players];
    shuffle(players);
    expect(players).toEqual(copy);
  });
});

describe('pickChallenge', () => {
  it('returns null when no challenges are eligible', () => {
    const challenges = [challenge('a', 5), challenge('b', 10)];
    expect(pickChallenge(challenges, 3)).toBeNull();
  });

  it('returns null when the list is empty', () => {
    expect(pickChallenge([], 4)).toBeNull();
  });

  it('only returns challenges with minPlayers <= playerCount', () => {
    const challenges = [challenge('small', 2), challenge('large', 8)];
    const result = pickChallenge(challenges, 4);
    expect(result?.id).toBe('small');
  });

  it('returns a challenge when playerCount matches exactly minPlayers', () => {
    const challenges = [challenge('exact', 3)];
    expect(pickChallenge(challenges, 3)).not.toBeNull();
  });
});

describe('resolveRound', () => {
  it('removes the eliminated player from survivors', () => {
    const result = resolveRound(['Alice', 'Bob', 'Charlie', 'Dave'], 'Bob');
    expect(result.type).toBe('continue');
    if (result.type === 'continue') {
      expect(result.survivors).not.toContain('Bob');
    }
  });

  it('returns winner when only one player survives', () => {
    const result = resolveRound(['Alice', 'Bob'], 'Bob');
    expect(result).toEqual({ type: 'winner', winner: 'Alice' });
  });

  it('returns finale when two players survive', () => {
    const result = resolveRound(['Alice', 'Bob', 'Charlie'], 'Charlie');
    expect(result).toEqual({
      type: 'finale',
      finalists: ['Alice', 'Bob'],
    });
  });

  it('returns continue when more than two players survive', () => {
    const result = resolveRound(['Alice', 'Bob', 'Charlie', 'Dave'], 'Dave');
    expect(result.type).toBe('continue');
    if (result.type === 'continue') {
      expect(result.survivors).toEqual(['Alice', 'Bob', 'Charlie']);
    }
  });

  it('stops the game when all but one player is eliminated over multiple rounds', () => {
    let active = ['Alice', 'Bob', 'Charlie'];
    let result = resolveRound(active, 'Charlie');
    expect(result.type).toBe('finale');

    if (result.type === 'finale') {
      active = [...result.finalists];
    }
    result = resolveRound(active, 'Bob');
    expect(result).toEqual({ type: 'winner', winner: 'Alice' });
  });
});
