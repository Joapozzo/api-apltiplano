import type { CatalogoServicioPar, PublicCatalogQuery, SalidaPublicaPar } from "../types/public-salidas.dto.js";

function precioMin(p: SalidaPublicaPar["expedicion"]): number {
  const arr = p.precios as Array<{ precio: number }>;
  if (!arr?.length) return Number.POSITIVE_INFINITY;
  return Math.min(...arr.map((x) => x.precio));
}

export function sortSalidaPares(pares: SalidaPublicaPar[], orden: PublicCatalogQuery["orden"]): SalidaPublicaPar[] {
  const copy = [...pares];

  switch (orden) {
    case "nombre":
      return copy.sort((a, b) => String(a.servicio.nombre).localeCompare(String(b.servicio.nombre), "es"));
    case "dificultad":
      return copy.sort((a, b) => Number(b.servicio.altura_maxima ?? 0) - Number(a.servicio.altura_maxima ?? 0));
    case "precio":
      return copy.sort((a, b) => precioMin(a.expedicion) - precioMin(b.expedicion));
    case "fecha":
    default:
      return copy.sort(
        (a, b) => new Date(a.expedicion.fecha_salida).getTime() - new Date(b.expedicion.fecha_salida).getTime(),
      );
  }
}

function expedicionesDeCatalogo(x: CatalogoServicioPar): SalidaPublicaPar["expedicion"][] {
  if (x.expediciones?.length) return x.expediciones;
  return x.expedicion ? [x.expedicion] : [];
}

function precioMinGrupo(x: CatalogoServicioPar): number {
  const list = expedicionesDeCatalogo(x);
  if (!list.length) return Number.POSITIVE_INFINITY;
  return Math.min(...list.map(precioMin));
}

export function sortCatalogoServicioPares(
  items: CatalogoServicioPar[],
  orden: PublicCatalogQuery["orden"],
): CatalogoServicioPar[] {
  const copy = [...items];
  const fechaVal = (x: CatalogoServicioPar) => {
    const prox = expedicionesDeCatalogo(x)[0];
    return prox?.fecha_salida ? new Date(prox.fecha_salida).getTime() : Number.POSITIVE_INFINITY;
  };

  switch (orden) {
    case "nombre":
      return copy.sort((a, b) => String(a.servicio.nombre).localeCompare(String(b.servicio.nombre), "es"));
    case "dificultad":
      return copy.sort((a, b) => Number(b.servicio.altura_maxima ?? 0) - Number(a.servicio.altura_maxima ?? 0));
    case "precio":
      return copy.sort((a, b) => precioMinGrupo(a) - precioMinGrupo(b));
    case "fecha":
    default:
      return copy.sort((a, b) => fechaVal(a) - fechaVal(b));
  }
}
