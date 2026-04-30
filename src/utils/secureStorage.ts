import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@medway_secure:";

interface StoredItem<T> {
  value: T;
  expiresAt?: number;
}

export async function secureSet<T>(
  key: string,
  value: T,
  ttlMinutes?: number,
): Promise<void> {
  const item: StoredItem<T> = {
    value,
    expiresAt: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : undefined,
  };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(item));
}

export async function secureGet<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;

  const item: StoredItem<T> = JSON.parse(raw);

  if (item.expiresAt && Date.now() > item.expiresAt) {
    await AsyncStorage.removeItem(PREFIX + key);
    return null;
  }

  return item.value;
}

export async function secureRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + key);
}

export async function secureClearAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const medwayKeys = keys.filter((k) => k.startsWith(PREFIX));
  await AsyncStorage.multiRemove(medwayKeys);
}

export const STORAGE_KEYS = {
  SESSION_CACHE: "session_cache",
  MFA_FACTOR_ID: "mfa_factor_id",
  LAST_SYNC: "last_sync",
  USER_PREFS: "user_prefs",
} as const;
