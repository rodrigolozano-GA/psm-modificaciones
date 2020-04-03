import { Tecnico } from './Tecnico';

export class Zona {
    id: number;
    nombre: string;
    estatus: number;
    coordinador_id: number;
    coordinador: string;
    tipoServicio_id: number;
    tipoServicio: string;
    tecnicos: Tecnico[];

    constructor() {}
}

export class ZonaLst {
    id: number;
    nombre: string;

    constructor() {}
}