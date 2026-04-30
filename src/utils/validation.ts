export function sanitizeText(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .slice(0, 500);
}

export function sanitizeName(input: string): string {
  return input
    .trim()
    .replace(/[^a-zA-ZÀ-ÿ\s.'-]/g, "")
    .slice(0, 150);
}

export function sanitizeAddress(input: string): string {
  return input.trim().replace(/[<>]/g, "").slice(0, 300);
}

export function sanitizeComment(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .slice(0, 1000);
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Mínimo 8 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("Pelo menos uma letra maiúscula");
  if (!/[a-z]/.test(password)) errors.push("Pelo menos uma letra minúscula");
  if (!/[0-9]/.test(password)) errors.push("Pelo menos um número");
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    errors.push("Pelo menos um caractere especial (!@#$%...)");
  return { valid: errors.length === 0, errors };
}

export function validateCycleTarget(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 12;
}

export function sanitizeDoctorForm(form: {
  name: string;
  specialty: string;
  address: string;
  hours: string;
}) {
  return {
    name: sanitizeName(form.name),
    specialty: sanitizeText(form.specialty),
    address: sanitizeAddress(form.address),
    hours: sanitizeText(form.hours),
  };
}
