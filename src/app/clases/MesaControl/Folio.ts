import { Servicio } from './Servicio';
export class Folio {
    id: number;
    numero: number;
    folio: string;
    archivo: string;
    fecha_programada: string;
    medio_id: number;
    medio: string;
    cliente_id: number;
    cliente: string;
    sucursal_id: number;
    sucursal: string;
    tipoequipo_id: number;
    tipoequipo: string;
    tiposervicio_id: number;
    tiposervicio: string;
    coodinador_id: number;
    coodinador: string;
    ot?: string;
    ticket?: string;
    servicios: Servicio[];
    descripcion: string;
    observaciones: string;
    estatus: string;
    estatus_id: number;
    zona: string;
    zona_id: number;
    direccion: string;
    actualizaciones: number;
    dias?: number;

    constructor () {

    }

}