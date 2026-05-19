/**
 * Cuerpos para crear entradas de catálogo desde el admin (alta rápida).
 */
export type CreateUbicacionBody = {
  pais: string;
  provincia: string;
  zona: string;
  orden?: number;
};

export type CreateLugarBody = {
  nombre: string;
  id_ubicacion: number;
  tipo_lugar?: string;
  altitud?: number;
  descripcion?: string | null;
  orden?: number;
};

export type CreateActividadBody = {
  nombre: string;
  descripcion?: string | null;
  orden?: number;
};

export type CreateDificultadBody = {
  nivel: string;
  descripcion?: string | null;
  orden?: number;
};

export type UpdateUbicacionBody = Partial<CreateUbicacionBody> & { activo?: boolean };
export type UpdateLugarBody = Partial<Omit<CreateLugarBody, "id_ubicacion">> & { id_ubicacion?: number; activo?: boolean };
export type UpdateActividadBody = Partial<CreateActividadBody> & { activo?: boolean };
export type UpdateDificultadBody = Partial<CreateDificultadBody> & { activo?: boolean };
