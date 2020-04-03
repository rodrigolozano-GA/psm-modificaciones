import { Servicio } from './Servicio';
import { Traslado } from './Traslado';
import { Viatico } from './Viatico';

export class Cotizacion {
    id: number;
    numero: number;
    folio: string;
    cliente: string;
    cliente_id: number;
    sucursal: string;
    sucursal_id: number;
    tipoServicio_id: number;
    tipoServicio: string;
    servicios: Servicio[];
    costokm: number;
    viaticoAlimento: number;
    viaticoHospedaje: number;
    traslados: Traslado[];
    viaticos: Viatico[];
    pdf: string;
    fechaRegistro: string;
    //estatus cot
    estatus_id: any;
    constructor () {

    }
}