import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../../utils/app-error.js";
const cloudinaryConfig = {};
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
async function upload(payload) {
    assertCloudinaryConfig();
    return new Promise((resolve, reject) => {
        const uploadOptions = {
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
async function deleteByPublicId(publicId) {
    assertCloudinaryConfig();
    await cloudinary.uploader.destroy(publicId);
}
async function deleteFolder(carpeta) {
    assertCloudinaryConfig();
    await cloudinary.api.delete_resources_by_prefix(carpeta);
    await cloudinary.api.delete_folder(carpeta);
}
export const cloudinaryAdapter = {
    upload,
    delete: deleteByPublicId,
    deleteFolder,
};
//# sourceMappingURL=cloudinary.adapter.js.map