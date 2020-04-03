export class Acta {
    id: number;
    folio: string;
    servicio: number;
    constructor() { }
}

export class ActaEnvio {
    id: number;
    folio_envio: number;
    persona_envia: string;
    actas: Acta[];

    constructor() { }
}

export class AdminActa {
    solicitud_id: number;
    tecnico_id: number;
    nempleado: string;
    nombre: string;
    formato: string;
    acta_inicial: number;
    acta_final: number;
    comprobadas: number;
    total: number;
    estatus: string;

    constructor() { }
}

export class ActaPeticion {
    id: number;
    folio: number;
    solicitante: string;
    tecnico: string;
    tecnico_id: number;
    formato: string;
    formato_id: number;
    actas: number; //cantidad

    constructor() { }
}