import { supabase } from "../lib/supabase";
import { secureSet, secureGet } from "../utils/secureStorage";

export interface ConsentRecord {
  userId: string;
  acceptedAt: string;
  termsVersion: string;
  privacyVersion: string;
}

const TERMS_VERSION = "1.0";
const PRIVACY_VERSION = "1.0";

export async function saveConsent(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const record: ConsentRecord = {
    userId: userData.user.id,
    acceptedAt: new Date().toISOString(),
    termsVersion: TERMS_VERSION,
    privacyVersion: PRIVACY_VERSION,
  };

  await secureSet("consent_record", record, 60 * 24 * 365);

  await supabase.auth.updateUser({
    data: {
      consent_accepted_at: record.acceptedAt,
      consent_terms_version: TERMS_VERSION,
      consent_privacy_version: PRIVACY_VERSION,
      lgpd_consent: true,
    },
  });
}

export async function hasValidConsent(): Promise<boolean> {
  const record = await secureGet<ConsentRecord>("consent_record");
  if (!record) return false;
  return (
    record.termsVersion === TERMS_VERSION &&
    record.privacyVersion === PRIVACY_VERSION
  );
}

export async function revokeConsent(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await secureSet("consent_record", null);
  await supabase.auth.updateUser({
    data: {
      lgpd_consent: false,
      consent_revoked_at: new Date().toISOString(),
    },
  });
}

export async function getConsentRecord(): Promise<ConsentRecord | null> {
  return secureGet<ConsentRecord>("consent_record");
}
