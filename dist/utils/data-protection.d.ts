export declare function isEncryptionEnabled(): boolean;
export declare function encryptSensitiveData(data: Record<string, unknown>): Record<string, unknown>;
export declare function decryptSensitiveData(data: Record<string, unknown>): Record<string, unknown>;
export declare function encryptObjectFields(obj: Record<string, unknown>, fields: string[]): Record<string, unknown>;
export declare function decryptObjectFields(obj: Record<string, unknown>, fields: string[]): Record<string, unknown>;
//# sourceMappingURL=data-protection.d.ts.map