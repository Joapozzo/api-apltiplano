import { prisma } from "../../database/prisma.js";
import { decryptClientePii } from "../../utils/data-protection.js";
export async function getDashboardActividad() {
    const inscripciones = await prisma.inscripciones.findMany({
        take: 10,
        orderBy: {
            fecha_inscripcion: "desc",
        },
        include: {
            clientes: {
                select: {
                    nombre: true,
                    apellido: true,
                    email: true,
                },
            },
            expediciones: {
                select: {
                    fecha_salida: true,
                    servicios: {
                        select: {
                            nombre: true,
                        },
                    },
                },
            },
        },
    });
    return inscripciones.map((inscripcion) => {
        const cliente = decryptClientePii(inscripcion.clientes);
        return {
            id_inscripcion: inscripcion.id_inscripcion,
            fecha_inscripcion: inscripcion.fecha_inscripcion,
            estado: inscripcion.estado,
            reserva_pagada: inscripcion.reserva_pagada,
            saldo_pagado: inscripcion.saldo_pagado,
            cliente: {
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email,
            },
            expedicion: {
                nombre_servicio: inscripcion.expediciones.servicios.nombre,
                fecha_salida: inscripcion.expediciones.fecha_salida,
            },
        };
    });
}
//# sourceMappingURL=dashboard-actividad.service.js.map