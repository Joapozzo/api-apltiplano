import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
function getFirebaseCredential() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey) {
        return null;
    }
    return cert({
        projectId,
        clientEmail,
        privateKey,
    });
}
function getFirebaseApp() {
    const existingApp = getApps()[0];
    if (existingApp) {
        return existingApp;
    }
    const credential = getFirebaseCredential();
    if (credential) {
        return initializeApp({ credential });
    }
    return initializeApp();
}
export function firebaseAdminAuth() {
    return getAuth(getFirebaseApp());
}
//# sourceMappingURL=firebase-admin.service.js.map