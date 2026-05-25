/**
 * Slug público alineado con `client/src/app/lib/expedicion-links.ts` (normalizeToSlug).
 */
export function slugFromNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Variantes aceptadas en URLs (p. ej. `champaqui` además de `cerro-champaqui`). */
/** Slug por defecto al crear servicio (URLs cortas tipo `champaqui`). */
export function defaultSlugForNombre(nombre: string): string {
  const full = slugFromNombre(nombre);
  const short = full.replace(/^cerro-/, "");
  return short !== full ? short : full;
}

export function slugVariantsFromNombre(nombre: string): string[] {
  const primary = slugFromNombre(nombre);
  const variants = new Set<string>([primary]);
  const withoutCerro = primary.replace(/^cerro-/, "");
  if (withoutCerro && withoutCerro !== primary) {
    variants.add(withoutCerro);
  }
  return [...variants];
}

export function identificadorMatchesServicio(
  identificador: string,
  nombre: string,
  slugDb: string | null | undefined,
): boolean {
  const id = identificador.trim().toLowerCase();
  if (!id) return false;
  if (slugDb?.trim().toLowerCase() === id) return true;
  return slugVariantsFromNombre(nombre).some((v) => v === id);
}
