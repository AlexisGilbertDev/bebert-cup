import { readJson, writeJson } from './local-storage';

export const EQUIPMENT_STORAGE_KEY = 'bebert-cup:equipment';

export type ChallengeEquipment = 'but' | 'mur';

export interface EquipmentSettings {
  but: boolean;
  mur: boolean;
}

export const DEFAULT_EQUIPMENT_SETTINGS: EquipmentSettings = {
  but: true,
  mur: true,
};

export function readEquipmentSettings(): EquipmentSettings {
  return readJson(EQUIPMENT_STORAGE_KEY, DEFAULT_EQUIPMENT_SETTINGS);
}

export function writeEquipmentSettings(settings: EquipmentSettings): void {
  writeJson(EQUIPMENT_STORAGE_KEY, settings);
}

export function isChallengePlayable(
  challenge: { equipment?: ChallengeEquipment },
  settings: EquipmentSettings,
): boolean {
  return !challenge.equipment || settings[challenge.equipment];
}
