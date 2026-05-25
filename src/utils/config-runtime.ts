import { prisma } from "../database/prisma.js";
import { CONFIG_KEYS, type ConfigKey, CONFIG_REGISTRY } from "./config-keys.js";

const TTL_MS = 60_000;

interface CacheEntry {
  value: unknown;
  expires: number;
}

const cache = new Map<string, CacheEntry>();

function getFromCache(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key: string, value: unknown) {
  cache.set(key, { value, expires: Date.now() + TTL_MS });
}

export function invalidateConfigCache() {
  cache.clear();
}

export async function getConfigString(key: ConfigKey, fallback?: string): Promise<string> {
  const cached = getFromCache(key);
  if (cached !== null) return cached as string;

  const row = await prisma.configuracion_sistema.findUnique({
    where: { clave: key },
  });

  if (row) {
    setCache(key, row.valor);
    return row.valor;
  }

  const envKey = key.replace(/\./g, "_").toUpperCase();
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    return envValue;
  }

  return fallback ?? CONFIG_REGISTRY[key].defaultValue;
}

export async function getConfigNumber(key: ConfigKey, fallback?: number): Promise<number> {
  const cached = getFromCache(key);
  if (cached !== null) return cached as number;

  const row = await prisma.configuracion_sistema.findUnique({
    where: { clave: key },
  });

  if (row) {
    const num = Number(row.valor);
    setCache(key, num);
    return num;
  }

  const envKey = key.replace(/\./g, "_").toUpperCase();
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    return Number(envValue);
  }

  return fallback ?? Number(CONFIG_REGISTRY[key].defaultValue);
}

export async function getConfigBoolean(key: ConfigKey, fallback?: boolean): Promise<boolean> {
  const cached = getFromCache(key);
  if (cached !== null) return cached as boolean;

  const row = await prisma.configuracion_sistema.findUnique({
    where: { clave: key },
  });

  if (row) {
    const bool = row.valor === "true";
    setCache(key, bool);
    return bool;
  }

  const envKey = key.replace(/\./g, "_").toUpperCase();
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    return envValue === "true";
  }

  return fallback ?? CONFIG_REGISTRY[key].defaultValue === "true";
}

export async function getConfigJSON<T>(key: ConfigKey, fallback?: T): Promise<T> {
  const cached = getFromCache(key);
  if (cached !== null) return cached as T;

  const row = await prisma.configuracion_sistema.findUnique({
    where: { clave: key },
  });

  if (row) {
    try {
      const parsed = JSON.parse(row.valor) as T;
      setCache(key, parsed);
      return parsed;
    } catch {
      return fallback ?? (CONFIG_REGISTRY[key].defaultValue as T);
    }
  }

  return fallback ?? (CONFIG_REGISTRY[key].defaultValue as T);
}

export async function getMonedaDefault(): Promise<string> {
  return getConfigString(CONFIG_KEYS.MONEDA_DEFAULT, "ARS");
}

export async function getUploadMaxPorMes(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.UPLOAD_MAX_POR_MES, 50);
}

export async function getInscripcionTokenDias(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.INSCRIPCION_TOKEN_DIAS, 7);
}

export async function getPresupuestoDiasValidez(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.PRESUPUESTO_DIAS_VALIDEZ, 15);
}

export async function getExpedicionEstadoInicial(): Promise<string> {
  return getConfigString(CONFIG_KEYS.EXPEDICION_ESTADO_INICIAL, "Activa");
}

export async function getInscripcionEstadoInicial(): Promise<string> {
  return getConfigString(CONFIG_KEYS.INSCRIPCION_ESTADO_INICIAL, "Inscripto");
}

export async function getNotificacionUmbralCuposCriticos(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.NOTIFICACIONES_UMBRAL_CUPOS_CRITICOS, 2);
}

export async function getNotificacionDiasPresupuestoAviso(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.NOTIFICACIONES_DIAS_PRESUPUESTO_AVISO, 7);
}

export async function getNotificacionDiasSalidaProxima(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.NOTIFICACIONES_DIAS_SALIDA_PROXIMA, 7);
}

export async function getNotificacionDiasSalidaUrgente(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.NOTIFICACIONES_DIAS_SALIDA_URGENTE, 3);
}

export async function getNotificacionDiasRetencion(): Promise<number> {
  return getConfigNumber(CONFIG_KEYS.NOTIFICACIONES_DIAS_RETENCION, 90);
}
