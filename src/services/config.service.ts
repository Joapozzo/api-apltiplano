import { prisma } from "../database/prisma.js";
import {
  CONFIG_KEYS,
  CONFIG_REGISTRY,
  isValidConfigKey,
  getConfigMetadata,
  type ConfigKey,
} from "../utils/config-keys.js";
import { invalidateConfigCache } from "../utils/config-runtime.js";

export class ConfigServiceError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ConfigServiceError";
    this.status = status;
    if (code !== undefined) {
      this.code = code;
    }
  }
}

export interface ConfigItem {
  clave: string;
  valor: string;
  tipo: string;
  grupo: string;
  etiqueta: string;
  descripcion?: string | null;
  editable: boolean;
}

export interface ConfigListItem extends ConfigItem {
  metadata: {
    publicReadable: boolean;
    defaultValue: string;
  };
}

export class ConfigService {
  static async getAll(): Promise<ConfigListItem[]> {
    const rows = await prisma.configuracion_sistema.findMany({
      orderBy: { grupo: "asc" },
    });

    return rows.map((row) => {
      const metadata = getConfigMetadata(row.clave as ConfigKey);
      return {
        clave: row.clave,
        valor: row.valor,
        tipo: row.tipo,
        grupo: row.grupo,
        etiqueta: row.etiqueta,
        descripcion: row.descripcion,
        editable: row.editable,
        metadata: {
          publicReadable: metadata?.publicReadable ?? false,
          defaultValue: metadata?.defaultValue ?? "",
        },
      };
    });
  }

  static async getByClave(clave: string): Promise<ConfigListItem | null> {
    if (!isValidConfigKey(clave)) {
      throw new ConfigServiceError("Clave de configuración desconocida", 400, "UNKNOWN_CONFIG_KEY");
    }

    const row = await prisma.configuracion_sistema.findUnique({
      where: { clave },
    });

    if (!row) {
      return null;
    }

    const metadata = getConfigMetadata(clave);
    return {
      clave: row.clave,
      valor: row.valor,
      tipo: row.tipo,
      grupo: row.grupo,
      etiqueta: row.etiqueta,
      descripcion: row.descripcion,
      editable: row.editable,
      metadata: {
        publicReadable: metadata?.publicReadable ?? false,
        defaultValue: metadata?.defaultValue ?? "",
      },
    };
  }

  static async set(clave: string, valor: string): Promise<ConfigListItem> {
    if (!isValidConfigKey(clave)) {
      throw new ConfigServiceError("Clave de configuración desconocida", 400, "UNKNOWN_CONFIG_KEY");
    }

    const metadata = getConfigMetadata(clave);
    if (!metadata.editable) {
      throw new ConfigServiceError("Esta clave no es editable", 403, "CONFIG_NOT_EDITABLE");
    }

    try {
      metadata.validate(valor);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Validación fallida";
      throw new ConfigServiceError(message, 400, "INVALID_VALUE");
    }

    const tipo = metadata.tipo;
    let valorFinal = valor;
    if (tipo === "number") {
      valorFinal = String(Number(valor));
    } else if (tipo === "boolean") {
      valorFinal = valor === "true" ? "true" : "false";
    }

    const updated = await prisma.configuracion_sistema.upsert({
      where: { clave },
      update: {
        valor: valorFinal,
        tipo,
        grupo: metadata.grupo,
        etiqueta: metadata.etiqueta,
        editable: metadata.editable,
      },
      create: {
        clave,
        valor: valorFinal,
        tipo,
        grupo: metadata.grupo,
        etiqueta: metadata.etiqueta,
        editable: metadata.editable,
      },
    });

    invalidateConfigCache();

    return {
      clave: updated.clave,
      valor: updated.valor,
      tipo: updated.tipo,
      grupo: updated.grupo,
      etiqueta: updated.etiqueta,
      descripcion: updated.descripcion,
      editable: updated.editable,
      metadata: {
        publicReadable: metadata.publicReadable,
        defaultValue: metadata.defaultValue,
      },
    };
  }

  static async setBatch(items: Array<{ clave: string; valor: string }>): Promise<ConfigListItem[]> {
    const results: ConfigListItem[] = [];

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (!isValidConfigKey(item.clave)) {
          throw new ConfigServiceError(`Clave desconocida: ${item.clave}`, 400, "UNKNOWN_CONFIG_KEY");
        }

        const metadata = getConfigMetadata(item.clave);
        if (!metadata.editable) {
          throw new ConfigServiceError(`Clave no editable: ${item.clave}`, 403, "CONFIG_NOT_EDITABLE");
        }

        try {
          metadata.validate(item.valor);
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Validación fallida";
          throw new ConfigServiceError(message, 400, "INVALID_VALUE");
        }

        const tipo = metadata.tipo;
        let valorFinal = item.valor;
        if (tipo === "number") {
          valorFinal = String(Number(item.valor));
        } else if (tipo === "boolean") {
          valorFinal = item.valor === "true" ? "true" : "false";
        }

        const updated = await tx.configuracion_sistema.upsert({
          where: { clave: item.clave },
          update: { valor: valorFinal },
          create: {
            clave: item.clave,
            valor: valorFinal,
            tipo,
            grupo: metadata.grupo,
            etiqueta: metadata.etiqueta,
            editable: metadata.editable,
          },
        });

        results.push({
          clave: updated.clave,
          valor: updated.valor,
          tipo: updated.tipo,
          grupo: updated.grupo,
          etiqueta: updated.etiqueta,
          descripcion: updated.descripcion,
          editable: updated.editable,
          metadata: {
            publicReadable: metadata.publicReadable,
            defaultValue: metadata.defaultValue,
          },
        });
      }
    });

    invalidateConfigCache();
    return results;
  }
}