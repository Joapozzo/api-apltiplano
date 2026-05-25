import { v2 as cloudinary, type ConfigOptions, type UploadApiOptions } from "cloudinary";
import { AppError } from "../../utils/app-error.js";
import type { StorageAdapter, UploadPayload, UploadResult } from "../types/upload.types.js";

const cloudinaryConfig: ConfigOptions = {};

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinaryConfig.cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
}

if (process.env.CLOUDINARY_API_KEY) {
  cloudinaryConfig.api_key = process.env.CLOUDINARY_API_KEY;
}

if (process.env.CLOUDINARY_API_SECRET) {
  cloudinaryConfig.api_secret = process.env.CLOUDINARY_API_SECRET;
}

cloudinary.config(cloudinaryConfig);

function assertCloudinaryConfig() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new AppError("Cloudinary no esta configurado correctamente", 500);
  }
}

async function upload(payload: UploadPayload): Promise<UploadResult> {
  assertCloudinaryConfig();

  return new Promise<UploadResult>((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder: payload.carpeta,
      overwrite: true,
      resource_type: "image",
      format: "webp",
    };

    if (payload.public_id) {
      uploadOptions.public_id = payload.public_id;
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        reject(new AppError("No se pudo subir la imagen a Cloudinary", 500));
        return;
      }

      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width ?? 0,
        height: result.height ?? 0,
        formato: result.format ?? "webp",
        bytes: result.bytes ?? 0,
      });
    });

    stream.end(payload.buffer);
  });
}

async function deleteByPublicId(publicId: string): Promise<void> {
  assertCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId);
}

async function deleteFolder(carpeta: string): Promise<void> {
  assertCloudinaryConfig();
  await cloudinary.api.delete_resources_by_prefix(carpeta);
  await cloudinary.api.delete_folder(carpeta);
}

export const cloudinaryAdapter: StorageAdapter = {
  upload,
  delete: deleteByPublicId,
  deleteFolder,
};
