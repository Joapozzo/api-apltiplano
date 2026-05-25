export function parseParamId(param: string | string[] | undefined): string {
  if (!param) return "";
  if (Array.isArray(param)) return param[0] || "";
  return param;
}

export function parseParamIdOptional(param: string | string[] | undefined): string | undefined {
  if (!param) return undefined;
  if (Array.isArray(param)) return param[0] || undefined;
  return param;
}
