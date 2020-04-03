export class Gasto {
    id: number;
    nombre: string;
    fechaRegistro: string;
    deducible: number;
    estatus: number;

    constructor() { }
}

export class ConceptoGasto {
    id: number;
    gasto_id: number;
    gasto: string;
    nombre: string;
    estatus: number;
    deducible: number;
    cantidad: number;

    constructor() { }
}