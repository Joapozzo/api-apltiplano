const MAGIC_BYTES: Record<string, { offset: number; signature: number[] }> = {
  "image/jpeg": { offset: 0, signature: [0xff, 0xd8, 0xff] },
  "image/png": { offset: 0, signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  "image/webp": { offset: 0, signature: [0x52, 0x49, 0x46, 0x46] },
};

export function validateMagicBytes(buffer: Buffer, mimetype: string): void {
  const rule = MAGIC_BYTES[mimetype];
  if (!rule) return;

  if (buffer.length < rule.signature.length) {
    throw new Error("Archivo corrupto o incompleto");
  }

  for (let i = 0; i < rule.signature.length; i++) {
    if (buffer[rule.offset + i] !== rule.signature[i]) {
      throw new Error("El archivo no coincide con el tipo de imagen declarado");
    }
  }

  if (mimetype === "image/webp") {
    if (buffer.length < 12 || buffer[8] !== 0x57 || buffer[9] !== 0x45 || buffer[10] !== 0x42 || buffer[11] !== 0x50) {
      throw new Error("El archivo no coincide con el tipo de imagen declarado");
    }
  }
}
