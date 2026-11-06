const blockedField = /api[_-]?key|password|secret|token|credential|authorization|system[_-]?prompt/i;

export function stripModuleSecrets(value: unknown, sensitiveFields: readonly string[] = []): unknown {
  if (Array.isArray(value)) return value.map(item => stripModuleSecrets(item, sensitiveFields));
  if (value instanceof Date) return value.toISOString();
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) =>
    !blockedField.test(key) && !sensitiveFields.includes(key),
  ).map(([key, item]) => [key, stripModuleSecrets(item, sensitiveFields)]));
}

export function publicModuleRow(row: object, fields: readonly string[], sensitiveFields: readonly string[] = []) {
  return stripModuleSecrets(Object.fromEntries(Object.entries(row).filter(([key]) => fields.includes(key))), sensitiveFields) as Record<string, unknown>;
}
