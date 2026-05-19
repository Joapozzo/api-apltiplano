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
} as const;

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

export const CONFIG_REGISTRY: Record<
  ConfigKey,
  {
    tipo: "string" | "number" | "boolean" | "json";
    grupo: "sistema" | "contacto" | "inscripcion" | "branding" | "notificaciones";
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
    defaultValue: "",
  },
  [CONFIG_KEYS.CONTACTO_EMAIL]: {
    tipo: "string",
    grupo: "contacto",
    etiqueta: "Email de contacto",
    editable: true,
    validate: (v) => {
      if (v && validateEmail) validateEmail(v);
    },
    publicReadable: true,
    defaultValue: "",
  },
  [CONFIG_KEYS.CONTACTO_TELEFONO]: {
    tipo: "string",
    grupo: "contacto",
    etiqueta: "Teléfono",
    editable: true,
    validate: validatePhone,
    publicReadable: true,
    defaultValue: "",
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
};

export function isValidConfigKey(key: string): key is ConfigKey {
  return key in CONFIG_REGISTRY;
}

export function getConfigMetadata(key: ConfigKey) {
  return CONFIG_REGISTRY[key];
}