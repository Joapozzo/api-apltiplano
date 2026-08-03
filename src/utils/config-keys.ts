export const CONFIG_KEYS = {
  MONEDA_DEFAULT: "sistema.moneda_default",
  UPLOAD_MAX_POR_MES: "sistema.upload_max_por_mes",
  INSCRIPCION_TOKEN_DIAS: "sistema.inscripcion_token_dias",
  PRESUPUESTO_DIAS_VALIDEZ: "sistema.presupuesto_dias_validez",
  EXPEDICION_ESTADO_INICIAL: "sistema.expedicion_estado_inicial",
  INSCRIPCION_ESTADO_INICIAL: "sistema.inscripcion_estado_inicial",
  CONTACTO_WHATSAPP: "contacto.whatsapp",
  CONTACTO_EMAIL: "contacto.email",
  CONTACTO_TELEFONO: "contacto.telefono",
  INSCRIPCION_TEXTO_CONFIDENCIALIDAD: "inscripcion.texto_confidencialidad",
  BRANDING_NOMBRE_EMPRESA: "branding.nombre_empresa",
  NOTIFICACIONES_UMBRAL_CUPOS_CRITICOS: "notificaciones.umbral_cupos_criticos",
  NOTIFICACIONES_DIAS_PRESUPUESTO_AVISO: "notificaciones.dias_presupuesto_aviso",
  NOTIFICACIONES_DIAS_SALIDA_PROXIMA: "notificaciones.dias_salida_proxima",
  NOTIFICACIONES_DIAS_SALIDA_URGENTE: "notificaciones.dias_salida_urgente",
  NOTIFICACIONES_DIAS_RETENCION: "notificaciones.dias_retencion",
  CONTENIDO_TIPS: "contenido.tips",
} as const;

/** Iconos Lucide permitidos en tips públicos (nombre string → map en el client). */
export const TIPS_ICON_NAMES = [
  "Calendar",
  "MapPin",
  "Thermometer",
  "Droplets",
  "Heart",
  "FileText",
  "Lightbulb",
  "Mountain",
  "Compass",
  "Backpack",
  "Sun",
  "Shield",
] as const;

export const DEFAULT_TIPS_CONFIG = {
  enabled: true,
  tips: [
    {
      id: 1,
      icon: "Calendar",
      categoria: "Planificación",
      titulo: "Días Extra = Tranquilidad",
      contenido:
        "Disponé de 2 días extras. El clima en montaña es cambiante y más tiempo te permitirá modificar el plan.",
      color: "from-blue-500 to-blue-600",
      activo: true,
      orden: 1,
    },
    {
      id: 2,
      icon: "MapPin",
      categoria: "Investigación",
      titulo: "Conocé tu Destino",
      contenido:
        "Investigá el lugar para combinar el viaje con otras experiencias y conocer costumbres locales.",
      color: "from-green-500 to-green-600",
      activo: true,
      orden: 2,
    },
    {
      id: 3,
      icon: "Thermometer",
      categoria: "Equipamiento",
      titulo: "Preparate para el Clima",
      contenido:
        "Invierno: cadenas, mantas térmicas. Verano: agua extra, sombrero y protector solar.",
      color: "from-orange-500 to-red-500",
      activo: true,
      orden: 3,
    },
    {
      id: 4,
      icon: "Droplets",
      categoria: "Hidratación",
      titulo: "Hidratación Constante",
      contenido:
        "En altura, tomá agua cada 15-20 min. Evitá alcohol 48hs antes de la expedición.",
      color: "from-cyan-500 to-blue-500",
      activo: true,
      orden: 4,
    },
    {
      id: 5,
      icon: "Heart",
      categoria: "Preparación",
      titulo: "Entrenamiento Previo",
      contenido:
        "Comenzá 6 semanas antes. Enfocate en cardio y piernas. Caminatas con mochila son ideales.",
      color: "from-pink-500 to-rose-500",
      activo: true,
      orden: 5,
    },
    {
      id: 6,
      icon: "FileText",
      categoria: "Documentación",
      titulo: "Permisos y Seguros",
      contenido:
        "Verificá DNI vigente, contratá un seguro de viaje y consultá permisos especiales.",
      color: "from-purple-500 to-indigo-500",
      activo: true,
      orden: 6,
    },
  ],
} as const;

export const DEFAULT_TIPS_CONFIG_JSON = JSON.stringify(DEFAULT_TIPS_CONFIG);

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

const MONEDAS_VALIDAS = ["ARS", "USD", "EUR"];

const validateMoneda = (valor: string) => {
  if (!MONEDAS_VALIDAS.includes(valor.toUpperCase())) {
    throw new Error(`Moneda inválida. Debe ser una de: ${MONEDAS_VALIDAS.join(", ")}`);
  }
};

const validateNumber = (valor: string, min?: number, max?: number) => {
  const num = Number(valor);
  if (isNaN(num)) throw new Error("El valor debe ser un número");
  if (min !== undefined && num < min) throw new Error(`El valor debe ser >= ${min}`);
  if (max !== undefined && num > max) throw new Error(`El valor debe ser <= ${max}`);
};

const validateEmail = (valor: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(valor)) throw new Error("Email inválido");
};

const validateRequired = (valor: string) => {
  if (!valor || valor.trim().length === 0) throw new Error("El valor es requerido");
};

const validatePhone = (valor: string) => {
  if (valor && !/^[+]?[\d\s()-]{7,20}$/.test(valor)) {
    throw new Error("Teléfono inválido");
  }
};

const TIPS_ICON_SET = new Set<string>(TIPS_ICON_NAMES);

const validateTipsJson = (valor: string) => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(valor);
  } catch {
    throw new Error("JSON de tips inválido");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Los tips deben ser un objeto { enabled, tips }");
  }

  const data = parsed as Record<string, unknown>;
  if (typeof data.enabled !== "boolean") {
    throw new Error("enabled debe ser boolean");
  }
  if (!Array.isArray(data.tips)) {
    throw new Error("tips debe ser un array");
  }
  if (data.tips.length > 20) {
    throw new Error("Máximo 20 tips");
  }

  for (const [index, tip] of data.tips.entries()) {
    if (!tip || typeof tip !== "object" || Array.isArray(tip)) {
      throw new Error(`Tip #${index + 1}: formato inválido`);
    }
    const t = tip as Record<string, unknown>;
    if (typeof t.id !== "number" || !Number.isFinite(t.id)) {
      throw new Error(`Tip #${index + 1}: id numérico requerido`);
    }
    if (typeof t.icon !== "string" || !TIPS_ICON_SET.has(t.icon)) {
      throw new Error(
        `Tip #${index + 1}: icon inválido. Permitidos: ${TIPS_ICON_NAMES.join(", ")}`,
      );
    }
    for (const field of ["categoria", "titulo", "contenido", "color"] as const) {
      if (typeof t[field] !== "string" || !(t[field] as string).trim()) {
        throw new Error(`Tip #${index + 1}: ${field} es requerido`);
      }
    }
    if ((t.titulo as string).length > 80) {
      throw new Error(`Tip #${index + 1}: título máximo 80 caracteres`);
    }
    if ((t.contenido as string).length > 400) {
      throw new Error(`Tip #${index + 1}: contenido máximo 400 caracteres`);
    }
    if (typeof t.activo !== "boolean") {
      throw new Error(`Tip #${index + 1}: activo debe ser boolean`);
    }
    if (typeof t.orden !== "number" || !Number.isFinite(t.orden)) {
      throw new Error(`Tip #${index + 1}: orden numérico requerido`);
    }
  }
};

export const CONFIG_REGISTRY: Record<
  ConfigKey,
  {
    tipo: "string" | "number" | "boolean" | "json";
    grupo: "sistema" | "contacto" | "inscripcion" | "branding" | "notificaciones" | "contenido";
    etiqueta: string;
    editable: boolean;
    validate: (raw: string) => void;
    publicReadable: boolean;
    defaultValue: string;
  }
> = {
  [CONFIG_KEYS.MONEDA_DEFAULT]: {
    tipo: "string",
    grupo: "sistema",
    etiqueta: "Moneda por defecto",
    editable: true,
    validate: validateMoneda,
    publicReadable: false,
    defaultValue: "ARS",
  },
  [CONFIG_KEYS.UPLOAD_MAX_POR_MES]: {
    tipo: "number",
    grupo: "sistema",
    etiqueta: "Uploads máximos por mes",
    editable: true,
    validate: (v) => validateNumber(v, 1, 500),
    publicReadable: false,
    defaultValue: "50",
  },
  [CONFIG_KEYS.INSCRIPCION_TOKEN_DIAS]: {
    tipo: "number",
    grupo: "sistema",
    etiqueta: "Días de validez del token de inscripción",
    editable: true,
    validate: (v) => validateNumber(v, 1, 90),
    publicReadable: false,
    defaultValue: "7",
  },
  [CONFIG_KEYS.PRESUPUESTO_DIAS_VALIDEZ]: {
    tipo: "number",
    grupo: "sistema",
    etiqueta: "Días de validez del presupuesto",
    editable: true,
    validate: (v) => validateNumber(v, 1, 60),
    publicReadable: false,
    defaultValue: "15",
  },
  [CONFIG_KEYS.EXPEDICION_ESTADO_INICIAL]: {
    tipo: "string",
    grupo: "sistema",
    etiqueta: "Estado inicial de expediciones",
    editable: true,
    validate: validateRequired,
    publicReadable: false,
    defaultValue: "Activa",
  },
  [CONFIG_KEYS.INSCRIPCION_ESTADO_INICIAL]: {
    tipo: "string",
    grupo: "inscripcion",
    etiqueta: "Estado inicial de inscripciones",
    editable: true,
    validate: validateRequired,
    publicReadable: false,
    defaultValue: "Inscripto",
  },
  [CONFIG_KEYS.CONTACTO_WHATSAPP]: {
    tipo: "string",
    grupo: "contacto",
    etiqueta: "WhatsApp",
    editable: true,
    validate: validatePhone,
    publicReadable: true,
    defaultValue: "+54 9 3837 49-8552",
  },
  [CONFIG_KEYS.CONTACTO_EMAIL]: {
    tipo: "string",
    grupo: "contacto",
    etiqueta: "Email de contacto",
    editable: true,
    validate: (v) => {
      if (v) validateEmail(v);
    },
    publicReadable: true,
    defaultValue: "info@altiplano.com",
  },
  [CONFIG_KEYS.CONTACTO_TELEFONO]: {
    tipo: "string",
    grupo: "contacto",
    etiqueta: "Teléfono",
    editable: true,
    validate: validatePhone,
    publicReadable: true,
    defaultValue: "+54 9 3837 49-8552",
  },
  [CONFIG_KEYS.INSCRIPCION_TEXTO_CONFIDENCIALIDAD]: {
    tipo: "string",
    grupo: "inscripcion",
    etiqueta: "Texto de confidencialidad (Step 3)",
    editable: true,
    validate: validateRequired,
    publicReadable: true,
    defaultValue: "Los datos médicos son confidenciales y solo se usarán para emergencia.",
  },
  [CONFIG_KEYS.BRANDING_NOMBRE_EMPRESA]: {
    tipo: "string",
    grupo: "branding",
    etiqueta: "Nombre de la empresa",
    editable: true,
    validate: validateRequired,
    publicReadable: true,
    defaultValue: "Altiplano",
  },
  [CONFIG_KEYS.NOTIFICACIONES_UMBRAL_CUPOS_CRITICOS]: {
    tipo: "number",
    grupo: "notificaciones",
    etiqueta: "Umbral de cupos críticos",
    editable: true,
    validate: (v) => validateNumber(v, 1, 10),
    publicReadable: false,
    defaultValue: "2",
  },
  [CONFIG_KEYS.NOTIFICACIONES_DIAS_PRESUPUESTO_AVISO]: {
    tipo: "number",
    grupo: "notificaciones",
    etiqueta: "Días de aviso para presupuesto",
    editable: true,
    validate: (v) => validateNumber(v, 1, 30),
    publicReadable: false,
    defaultValue: "7",
  },
  [CONFIG_KEYS.NOTIFICACIONES_DIAS_SALIDA_PROXIMA]: {
    tipo: "number",
    grupo: "notificaciones",
    etiqueta: "Días para notificación de salida próxima",
    editable: true,
    validate: (v) => validateNumber(v, 1, 30),
    publicReadable: false,
    defaultValue: "7",
  },
  [CONFIG_KEYS.NOTIFICACIONES_DIAS_SALIDA_URGENTE]: {
    tipo: "number",
    grupo: "notificaciones",
    etiqueta: "Días para notificación de salida urgente",
    editable: true,
    validate: (v) => validateNumber(v, 1, 7),
    publicReadable: false,
    defaultValue: "3",
  },
  [CONFIG_KEYS.NOTIFICACIONES_DIAS_RETENCION]: {
    tipo: "number",
    grupo: "notificaciones",
    etiqueta: "Días de retención de notificaciones",
    editable: true,
    validate: (v) => validateNumber(v, 7, 365),
    publicReadable: false,
    defaultValue: "90",
  },
  [CONFIG_KEYS.CONTENIDO_TIPS]: {
    tipo: "json",
    grupo: "contenido",
    etiqueta: "Tips de experiencia (widget flotante)",
    editable: true,
    validate: validateTipsJson,
    publicReadable: true,
    defaultValue: DEFAULT_TIPS_CONFIG_JSON,
  },
};

export function isValidConfigKey(key: string): key is ConfigKey {
  return key in CONFIG_REGISTRY;
}

export function getConfigMetadata(key: ConfigKey) {
  return CONFIG_REGISTRY[key];
}
