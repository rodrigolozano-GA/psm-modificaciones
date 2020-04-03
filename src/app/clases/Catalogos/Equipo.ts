export class Equipo {
    id: number;
    nombre: string;
    estatus: number;
    caracteristicas: Caracteristica[];


    constructor() { }
}

export class Caracteristica {
    id: number;
    nombre: string;
    descripcion: string;

    constructor() { }
}