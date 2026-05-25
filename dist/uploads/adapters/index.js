import { cloudinaryAdapter } from "./cloudinary.adapter.js";
import { localAdapter } from "./local.adapter.js";
export function hasCloudinaryConfig() {
    return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
export const storageAdapter = hasCloudinaryConfig() ? cloudinaryAdapter : localAdapter;
//# sourceMappingURL=index.js.map