export interface UploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
  formato: string;
  bytes: number;
}

export interface UploadPayload {
  buffer: Buffer;
  mimetype: string;
  carpeta: string;
  public_id?: string;
}

export interface StorageAdapter {
  upload(payload: UploadPayload): Promise<UploadResult>;
  delete(public_id: string): Promise<void>;
  deleteFolder(carpeta: string): Promise<void>;
}

export interface SubirImagenDTO {
  id_servicio: number;
  buffer: Buffer;
  mimetype: string;
  public_id?: string;
}

export interface RateLimitConfig {
  max_por_mes: number;
}
