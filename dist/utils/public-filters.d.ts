import type { Prisma } from "@prisma/client";
import type { PublicCatalogQuery } from "../types/public-salidas.dto.js";
/** Filtro por nombre/resumen y por franjas de altura (como el mock del front). */
export declare function buildServicioPublicWhere(q?: string, dificultad?: PublicCatalogQuery["dificultad"]): Prisma.serviciosWhereInput;
//# sourceMappingURL=public-filters.d.ts.map