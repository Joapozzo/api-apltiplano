export function servicioCarpeta(idServicio: number): string {
  return `altiplano/servicios/${idServicio}`;
}

export function servicioPublicIdGenerated(idServicio: number, suffix: string): string {
  return `${servicioCarpeta(idServicio)}/${suffix}`;
}

const COORDINADORES_FOLDER = "altiplano/coordinadores";

export function coordinadorFotoCarpeta(): string {
  return COORDINADORES_FOLDER;
}

/** Nombre del asset dentro de la carpeta; overwrite al reemplazar */
export function coordinadorFotoPublicId(idCoordinador: number): string {
  return String(idCoordinador);
}
