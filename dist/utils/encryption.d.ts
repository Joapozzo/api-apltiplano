export declare function isEncryptionAvailable(): boolean;
export declare function encrypt(plaintext: string): string;
export declare function decrypt(encryptedData: string): string;
export declare function hashData(data: string): string;
export declare function generateEncryptionKey(): string;
export declare const SensitiveFields: {
    usuario: string[];
    cliente: string[];
    inscripcion: string[];
    datos_medicos: string[];
};
export declare function encryptFields(data: Record<string, unknown>, fields: string[]): Record<string, unknown>;
export declare function decryptFields(data: Record<string, unknown>, fields: string[]): Record<string, unknown>;
//# sourceMappingURL=encryption.d.ts.map