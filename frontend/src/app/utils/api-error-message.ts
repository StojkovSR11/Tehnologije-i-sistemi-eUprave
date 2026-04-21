/** Poruka iz Gin odgovora `{ "error": "..." }` ili fallback. */
export function apiErrorMessage(err: unknown, fallback: string): string {
  const e = err as { error?: { error?: string; message?: string }; message?: string };
  return e?.error?.error || e?.error?.message || e?.message || fallback;
}
