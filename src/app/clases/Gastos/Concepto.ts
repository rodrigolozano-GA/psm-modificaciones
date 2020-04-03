export class Concepto {
    id: number;
    nombre: string;
    monto: number;
    tipoGasto: number;
    dividido: FolioConcepto[];

    constructor() { }
}

export class FolioConcepto {
    id: number;
    numero_servicio: number;
    
    constructor () {}
}

export class ConceptoList {
    id: number;
    nombre: string;

    constructor () {}
}