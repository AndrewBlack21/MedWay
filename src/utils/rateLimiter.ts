interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const attempts: Record<string, AttemptRecord> = {};

const CONFIG = {
  login: { maxAttempts: 5, windowMs: 5 * 60 * 1000, blockMs: 15 * 60 * 1000 },
  mfa: { maxAttempts: 3, windowMs: 2 * 60 * 1000, blockMs: 10 * 60 * 1000 },
  geocode: { maxAttempts: 10, windowMs: 60 * 1000, blockMs: 60 * 1000 },
};

type ActionType = keyof typeof CONFIG;

export function checkRateLimit(
  action: ActionType,
  identifier: string = "default",
): { allowed: boolean; waitSeconds?: number } {
  const key = `${action}_${identifier}`;
  const cfg = CONFIG[action];
  const now = Date.now();
  const record = attempts[key];

  if (record?.blockedUntil) {
    if (now < record.blockedUntil) {
      const wait = Math.ceil((record.blockedUntil - now) / 1000);
      return { allowed: false, waitSeconds: wait };
    }
    delete attempts[key];
  }

  if (!record || now - record.firstAttempt > cfg.windowMs) {
    attempts[key] = { count: 1, firstAttempt: now };
    return { allowed: true };
  }

  record.count++;
  if (record.count >= cfg.maxAttempts) {
    record.blockedUntil = now + cfg.blockMs;
    const wait = Math.ceil(cfg.blockMs / 1000);
    return { allowed: false, waitSeconds: wait };
  }

  return { allowed: true };
}

export function resetRateLimit(
  action: ActionType,
  identifier: string = "default",
): void {
  delete attempts[`${action}_${identifier}`];
}

export function formatWaitTime(seconds: number): string {
  if (seconds < 60) return `${seconds} segundos`;
  return `${Math.ceil(seconds / 60)} minutos`;
}
