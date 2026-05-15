import { Resend } from "resend";
import { createLogger } from "./logger.service.js";

const logger = createLogger("email");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Altiplano Experience <onboarding@resend.dev>";
const ADMIN_EMAIL = "info@altiplanoexperience.com";

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

async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    logger.warn({ to: options.to }, "Resend not configured, email skipped");
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (result.error) {
      logger.error({ error: result.error, to: options.to }, "Failed to send email");
      return false;
    }

    logger.info({ to: options.to, messageId: result.data?.id }, "Email sent");
    return true;
  } catch (error) {
    logger.error({ error, to: options.to }, "Error sending email");
    return false;
  }
}

export function generateInscripcionClienteEmail(data: InscripcionEmailData): EmailOptions {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Inscripción</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #f59e0b;">🎉 ¡Inscripción Confirmada!</h1>
  </div>

  <p>Hola <strong>${data.cliente.nombre} ${data.cliente.apellido}</strong>,</p>

  <p>¡Te damos la bienvenida a tu próxima aventura con Altiplano Experience!</p>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #f59e0b;">Detalles de tu expedition</h3>
    <p><strong>Salida:</strong> ${data.servicio.nombre}</p>
    <p><strong>Fecha:</strong> ${new Date(data.expedicion.fecha_salida).toLocaleDateString("es-AR")} - ${new Date(data.expedicion.fecha_fin).toLocaleDateString("es-AR")}</p>
    <p><strong>Estado:</strong> ${data.inscripcion.estado}</p>
  </div>

  <p>Nuestro equipo se pondra en contacto contigo proximamente con los detalles finales y logistical.</p>

  <p>¿Tenes alguna pregunta? Responde a este email o escribinos a <strong>${ADMIN_EMAIL}</strong></p>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #888;">
    <p>Altiplano Experience - Expediciones y Trekking en Argentina</p>
    <p>¿No deberías ver este email? <a href="mailto:${ADMIN_EMAIL}" style="color: #f59e0b;">Contactanos</a></p>
  </div>
</body>
</html>
  `.trim();

  return {
    to: data.cliente.email,
    subject: `Confirmación de inscripción - ${data.servicio.nombre}`,
    html,
  };
}

export function generateInscripcionAdminEmail(data: InscripcionEmailData & { clienteTelefono?: string; clienteDni?: string }): EmailOptions {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Inscripcion</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #f59e0b;">📋 Nueva Inscripción</h2>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Datos del Cliente</h3>
    <p><strong>Nombre:</strong> ${data.cliente.nombre} ${data.cliente.apellido}</p>
    <p><strong>Email:</strong> ${data.cliente.email}</p>
    ${data.clienteTelefono ? `<p><strong>Telefono:</strong> ${data.clienteTelefono}</p>` : ""}
    ${data.clienteDni ? `<p><strong>DNI:</strong> ${data.clienteDni}</p>` : ""}
  </div>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <h3>Datos de la Expedition</h3>
    <p><strong>Salida:</strong> ${data.servicio.nombre}</p>
    <p><strong>Fecha:</strong> ${new Date(data.expedicion.fecha_salida).toLocaleDateString("es-AR")} - ${new Date(data.expedicion.fecha_fin).toLocaleDateString("es-AR")}</p>
    <p><strong>ID Inscripcion:</strong> #${data.inscripcion.id}</p>
    <p><strong>Estado:</strong> ${data.inscripcion.estado}</p>
  </div>

  <p style="font-size: 12px; color: #888;">
    Ver en admin: <a href="https://www.altiplanoexperience.com/adm/inscripciones">Panel de Admin</a>
  </p>
</body>
</html>
  `.trim();

  return {
    to: ADMIN_EMAIL,
    subject: `Nueva inscripción: ${data.cliente.nombre} - ${data.servicio.nombre}`,
    html,
  };
}

export const EmailService = {
  async sendInscripcionConfirmacion(data: InscripcionEmailData): Promise<void> {
    await Promise.all([
      sendEmail(generateInscripcionClienteEmail(data)),
      sendEmail(generateInscripcionAdminEmail(data)),
    ]);
  },

  async sendEmail(options: EmailOptions): Promise<boolean> {
    return sendEmail(options);
  },
};