interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
interface InscripcionEmailData {
    cliente: {
        nombre: string;
        apellido: string;
        email: string;
    };
    servicio: {
        nombre: string;
        slug: string;
    };
    expedicion: {
        fecha_salida: string;
        fecha_fin: string;
    };
    inscripcion: {
        id: number;
        estado: string;
    };
}
export declare function generateInscripcionClienteEmail(data: InscripcionEmailData): EmailOptions;
export declare function generateInscripcionAdminEmail(data: InscripcionEmailData & {
    clienteTelefono?: string;
    clienteDni?: string;
}): EmailOptions;
export declare const EmailService: {
    sendInscripcionConfirmacion(data: InscripcionEmailData): Promise<void>;
    sendEmail(options: EmailOptions): Promise<boolean>;
};
export {};
//# sourceMappingURL=email.service.d.ts.map