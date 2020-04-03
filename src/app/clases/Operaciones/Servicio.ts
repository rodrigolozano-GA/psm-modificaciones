export class Servicio {
    id: number;
    folio: number;
    servicioId: number;
    servicio: string;
    servicios: [];
    estatus_Id: number;
    estatus_title: string;
    estatus: number;
    dias: number;
    cita: string;
    actas?: number;
    coordinador: string;
    zona: string;
    clienteId: number;
    cliente: string;
    sucursalId: number;
    sucursal: string;
    fecha_programada?: string;
    ot?: string;
    tc?: string;

    constructor() {
        
    }
}