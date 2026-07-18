import { describe, expect, it } from 'vitest';
import { buildInitialNames, buildInitialTeamNames } from './player-setup';

describe('buildInitialNames', () => {
  it('returns minPlayers empty strings when nothing is saved', () => {
    expect(buildInitialNames([], 3, 8)).toEqual(['', '', '']);
  });

  it('returns the saved names unchanged when within bounds', () => {
    expect(buildInitialNames(['Alice', 'Bob'], 2, 4)).toEqual(['Alice', 'Bob']);
  });

  it('pads with empty strings when fewer saved names than minPlayers', () => {
    expect(buildInitialNames(['Alice'], 3, 8)).toEqual(['Alice', '', '']);
  });

  it('truncates saved names to maxPlayers', () => {
    const saved = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'];
    expect(buildInitialNames(saved, 2, 4)).toEqual([
      'Alice',
      'Bob',
      'Charlie',
      'Dave',
    ]);
  });

  it('ignores non-array or malformed saved data', () => {
    expect(buildInitialNames(null as unknown as string[], 3, 8)).toEqual([
      '',
      '',
      '',
    ]);
    expect(
      buildInitialNames(['Alice', 42] as unknown as string[], 3, 8),
    ).toEqual(['Alice', '', '']);
  });
});

describe('buildInitialTeamNames', () => {
  it('splits minPlayers evenly across both teams when nothing is saved', () => {
    expect(buildInitialTeamNames(null, 4, 8)).toEqual({
      team1: ['', ''],
      team2: ['', ''],
    });
  });

  it('splits an odd minPlayers with the extra slot on team1', () => {
    expect(buildInitialTeamNames({ team1: [], team2: [] }, 5, 8)).toEqual({
      team1: ['', '', ''],
      team2: ['', ''],
    });
  });

  it('returns the saved teams unchanged when within bounds', () => {
    const saved = { team1: ['Alice', 'Bob'], team2: ['Charlie'] };
    expect(buildInitialTeamNames(saved, 4, 8)).toEqual(saved);
  });

  it('clamps the total to maxPlayers, favoring team1', () => {
    const saved = {
      team1: ['A', 'B', 'C', 'D', 'E'],
      team2: ['F', 'G', 'H', 'I'],
    };
    expect(buildInitialTeamNames(saved, 4, 6)).toEqual({
      team1: ['A', 'B', 'C', 'D', 'E'],
      team2: ['F'],
    });
  });

  it('never drops team2 entirely when team1 alone reaches maxPlayers', () => {
    const saved = {
      team1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      team2: ['I', 'J', 'K'],
    };
    const result = buildInitialTeamNames(saved, 4, 8);
    expect(result.team1).toHaveLength(7);
    expect(result.team2).toEqual(['I']);
  });

  it('ignores non-array or malformed saved data', () => {
    expect(
      buildInitialTeamNames(
        { team1: 'not-an-array', team2: null } as unknown as {
          team1: string[];
          team2: string[];
        },
        4,
        8,
      ),
    ).toEqual({ team1: ['', ''], team2: ['', ''] });
  });
});
