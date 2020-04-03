import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from './../../environments/environment';

/**
 * Obtener el formato de la Fecha Actual
 * @param tipo 
 */
function obtenerFechaActual(tipo = 0) {
	let fechaActual = "";

	// Obtener nombre del día del mes actual
	fechaActual = obtNombreDia(new Date().getDay());
	
	// Obtener número del día del mes actual
	fechaActual += ', ' + obtNumeroDíaMes(new Date().getDate());
	
	// Obtener nombre del mes actual
	fechaActual += ' de ' + obtNombreMes(new Date().getMonth());
	
	// Obtener el año actual
	fechaActual += ' de ' + new Date().getFullYear();
	
	return fechaActual;
}

/**
 * Obtener el nombre del día iniciando 0: Domingo, 1: Lunes, etc
 * @param numMes
 */
function obtNombreDia(numMes = 0) {
	let resultado = "";
	switch(numMes){
		case 0: resultado = 'domingo'; break;
		case 1: resultado = 'lunes'; break;
		case 2: resultado = 'martes'; break;
		case 3: resultado = 'miércoles'; break;
		case 4: resultado = 'jueves'; break;
		case 5: resultado = 'viernes'; break;
		case 6: resultado = 'sabado'; break;
	}
	return resultado;
}

/**
 * Obtener el número del día del mes actual
 * @param numMes
 */
function obtNumeroDíaMes(dia = 0) {
	return (""+dia).length > 1 ? ""+dia : "0"+dia;
}

/**
 * Obtener el nombre del mes actual
 * El valor devuelto por getMonth() es un entero entre 0 y 11, donde 0 corresponde a Enero, 1 a Febrero y así sucesivamente.
 * @param numMes
 */
function obtNombreMes(numMes = 0) {
	let resultado = "";
	switch(numMes){
		case 0: resultado = 'enero'; break;
		case 1: resultado = 'febrero'; break;
		case 2: resultado = 'marzo'; break;
		case 3: resultado = 'abril'; break;
		case 4: resultado = 'mayo'; break;
		case 5: resultado = 'junio'; break;
		case 6: resultado = 'julio'; break;
		case 7: resultado = 'agosto'; break;
		case 8: resultado = 'septiembre'; break;
		case 9: resultado = 'octubre'; break;
		case 10: resultado = 'noviembre'; break;
		case 11: resultado = 'diciembre'; break;
	}
	return resultado;
}


/**
 * Formatear cantidad a 2 decimales sin redondeo
 * @param cantidad 
 */
export function formatearCarntidad2Dig(cantidad) {
	let result = "";

	if((cantidad+"").split(".").length > 1) {
		let temp = (cantidad+"").split(".");
		let longitud = temp[1].length;
		if(longitud == 1)
			temp[1] = temp[1] + "0";
		if(longitud >= 2)
			temp[1] = temp[1][0] + temp[1][1]; 
		
		result = temp.join(".");
	} else {
		result = cantidad;
	}
	return result;
}

/**
 * Función para crear el cuerpo de la tabla de Traslados y Viáticos de una Cotización
 * @param datosPDF 
 */
function cuerpoViaticosDetalleCot (datosPDF) {
	let lista = [];
	if(datosPDF.trasladoviaticos == null)
	{
		return lista;
	}
	if(datosPDF.trasladoviaticos.length == 0)
	{	
		datosPDF.trasladosList = [];
		datosPDF.viaticosList = [];
		datosPDF.viaticosList.push({viaticoAlimento: 0, viaticoHospedaje: 0});
		
		datosPDF.trasladosList.push({costokm:0})
	}
	lista.push(
		[
			{
				colSpan: 11, text: 'DESCRIPIÓN DE VIÁTICOS', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center', border: [ false, false, false, false ]
			}, '', '', '', '', '', '', '', '', '', '' 
		],
		[
			{
				colSpan: 11, style: ['fontBody', 'fontColorBlue'], text: '', border: [ false, false, false, false ],
			}, '', '', '', '', '', '', '', '', '', ''
		],
		[ { colSpan: 11, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 0, border: [ false, false, false, false ] } ],
		[
			{
				colSpan: 3, text: 'TRASLADO', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, '', '', 
			{ 
				text: 'COSTO KM', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
				rowSpan: 2, margin: [0,4,0,0], text: 'CASETAS', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			},
			{
				text: 'ALIMENTOS', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
				text: 'HOSPEDAJE', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
				rowSpan: 2, margin: [0,4,0,0], text: 'PERSONAS', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
				rowSpan: 2, margin: [0,4,0,0], text: 'DÍAS', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
				rowSpan: 2, margin: [0,4,0,0], text: 'NOCHES', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			},
			{
				rowSpan: 2, margin: [0,4,0,0], text: 'TOTAL', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}
		],
		[
			{
				text: 'ORIGEN', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
				text: 'DESTINO', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			},
			{
				text: 'DISTANCIA', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'],  alignment: 'center',
			}, 
			{
			//	text: '$' + datosPDF.costokm, bold: true, style: ['fontBody'],  alignment: 'center',
				text: '$' + datosPDF.trasladosList[0].costokm , bold: true, style: ['fontBody'],  alignment: 'center',
			}, '',
			{
			//   text: '$' + datosPDF.viaticoAlimento, bold: true, style: ['fontBody'],  alignment: 'center',
			   text: '$' + datosPDF.viaticoAlimento, bold: true, style: ['fontBody'],  alignment: 'center',
			}, 
			{
			//	text: '$' + datosPDF.viaticoHospedaje, bold: true, style: ['fontBody'],  alignment: 'center',
				 text: '$' + datosPDF.viaticoHospedaje, bold: true, style: ['fontBody'],  alignment: 'center',
			},'', '', '',''
		]
	);
	
	if(datosPDF.trasladoviaticos !=null ){
		datosPDF.trasladoviaticos.forEach(element => {
			lista.push([
				{
					text: element.origen ? element.origen : '', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: element.destino ? element.destino : '', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: element.distancia ? element.distancia + '' : '0', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: '$' + formatearCarntidad2Dig((element.costokm ? element.costokm + '' : '0')), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: element.casetas ? element.casetas + '' : '0', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: '$' + formatearCarntidad2Dig((element.alimentos ? element.alimentos + '': '0')), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: '$' + formatearCarntidad2Dig((element.hospedaje ? element.hospedaje + '': '0')), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: element.personas ? element.personas + '' : '0', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				}, 
				{
					text: element.dias ? element.dias + '' : '0', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{
					text: element.noches ? element.noches + '' : '0', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				},
				{  //TOTAL
					text: '$' + formatearCarntidad2Dig(element.total), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
				}
			]);
		});
	}


	lista.push(
		[ { colSpan: 11, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 1, border: [ false, false, false, false ] } ],
		[
			{
				text: '', bold: false, border: [ false, false, false, false ], style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			}, 
			{
				text: 'TOTALES', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			},
			{
				text: formatearCarntidad2Dig(datosPDF.totales.ttldistancia+''), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			}, 
			{
				text: '$' + formatearCarntidad2Dig(datosPDF.totales.ttlcostokm+''), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			},
			{
				text: datosPDF.totales.ttlcasetas + '', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			},
			{
				text: '$' + formatearCarntidad2Dig(datosPDF.totales.ttlalimentos+''), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			}, 
			{
				text: '$' + formatearCarntidad2Dig(datosPDF.totales.ttlhospedaje+''), bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			},
			{
				text: datosPDF.totales.ttlpersonas + '', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			}, 
			{
				text: datosPDF.totales.ttldias + '', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			}, 
			{
				text: datosPDF.totales.ttlnoches + '', bold: false, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			},
			{
				text: '$' + formatearCarntidad2Dig(datosPDF.totales.total+''), bold: true, style: ['fontBody', 'fontColorBlue'],  alignment: 'center',
			}
		],
		[ { colSpan: 11, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 3, border: [ false, false, false, false ] } ]
	);

	return lista;
}

/**
 * Función para llenar la tabla de Productos/Servicios de una Cotización
 * @param datosPDF 
 */
function productoServicioDetalleCot(datosPDF) {
	let lista = [];

	datosPDF.ttlsServicios = {
		subtotal: 0,
		viaticos: 0,
		subttlviat: 0,
		iva: 0.16,
		total: 0
	}

	datosPDF.serviciosList.forEach(element => {
		datosPDF.ttlsServicios.subtotal += (element.precio * element.cantidad);

		lista.push([
			{
				text: element.codigo, bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], italics: true
			},
			{
				text: parseInt(element.cantidad), bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], italics: true
			},
			{
				text: element.concepto, bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], italics: true
			}, 
			{
				text: '$'+element.precio, bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], italics: true
			},
			{
				text: '$'+formatearCarntidad2Dig(element.precio * element.cantidad), bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], italics: true
			},
		]);
	});

	if(datosPDF.totales != null || datosPDF.totales != undefined)
	{
		datosPDF.ttlsServicios.viaticos = datosPDF.totales.total;
		datosPDF.ttlsServicios.subttlviat = formatearCarntidad2Dig(datosPDF.ttlsServicios.subtotal + datosPDF.ttlsServicios.viaticos);
		datosPDF.ttlsServicios.total = formatearCarntidad2Dig(datosPDF.ttlsServicios.subttlviat + (datosPDF.ttlsServicios.subttlviat * datosPDF.ttlsServicios.iva));
	}
	return lista;
}

/**
 * Función para llenar la tabla de Solicitudes de Actas
 * @param datosPDF 
 */
function SolicitudActasDetalle(datosPDF) {
	let lista = [
		[
			{
				style: 'tableHeader',
				text: 'NÚMERO DE SOLICITUD' 
			},
			{
				style: 'tableHeader',
				text: 'FOLIO INICIAL'
			},
			{
				style: 'tableHeader',
				text: 'FOLIO FINAL'
			},
			{
				style: 'tableHeader',
				text: 'FORMATO'
			}
		]
	];

	datosPDF.lstSolicitudes.forEach(element => {
		lista.push([
			{
				style: 'tableContent',
				text: element.folio
			},
			{
				style: 'tableContent',
				text: element.inicio
			},
			{
				style: 'tableContent',
				text: element.fin
			},
			{
				style: 'tableContent',
				text: element.formato
			}
		]);
	});

	return lista;
}

/**
 * Función principal para la creación de PDFs
 * @param datosPDF 
 */
export function pdfNvaCotizacion(datosPDF: any) {
	datosPDF.tablaviaticos = [];
	var myImage = new Image(100, 200);
	myImage.src = environment.LogoImg;
	let extencionImg = environment.LogoImg.split(".")[environment.LogoImg.split(".").length -1];
	
	myImage.onload = function () {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
	
		canvas.height = myImage.naturalHeight;
		canvas.width = myImage.naturalWidth;
		ctx.drawImage(myImage, 0, 0);
	
		var uri = canvas.toDataURL('image/' + extencionImg), b64 = uri;
		pdfMake.vfs = pdfFonts.pdfMake.vfs;

		var dd = {
			content: [{
					margin: [ 10, 25 ],
					table: {
						widths: [ '100%' ],
						body: [
							[
								[
									{ canvas: [{ type: 'rect', x: 0, y: 0, w: 305, h: 45, r: 5, lineColor: '#001040' }], absolutePosition: { x: 56, y: 72 } },
									{
										table: {
											widths: [ '65%', '3%', '32%' ],
											body: [
												[
													{
														text: [
															{
																text: 'ARMSTRONG PRIVATE SECURITY DE MEXICO S.A. DE C.V',
																alignment: 'center',
																style: ['headerAddress', 'fontColorBlue']
															},
															{
																text: '\nAV. VALLARTA 6503 PLAZA CONCENTRO LOCAL 13 B CONCENTRO LOCAL 13 B ZAPOPAN,\nJAL. R.F.C. APS 020621 G66 TEL. 01-800-7153595',
																alignment: 'center',
																style: ['headerAddress2', 'fontColorBlue']
															}
														],
														border: [ false, false, false, false ], margin: [ 0, 8 ]
													},
													{ text: "", border: [ false, false, false, false ] },
													{
														image: 'data:image/jpeg;base64,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',
														width: 130,
														height: 50,
														alignment: 'center',
														border: [ false, false, false, false ]
													}
												]
											]
										}
									},
									{
										table: {
											widths: [ '70%', '10%', '20%' ],
											body: [
												[
													{
														text: 'COTIZACIÓN', style: ['header', 'fontColorBlue'], border: [ false, false, false, false ]
													},
													{
														text: 'Fecha', style: ['header3', 'fontColorBlue'], alignment: 'rigth', border: [ false, false, false, false ]
													},
													{
														text: datosPDF.fechalocal, style: ['header3', 'fontColorBlue'], alignment: 'rigth', border: [ false, false, false, false ]
													}
												],
												[
													{
														text: datosPDF.tipoServicio, style: ['header2', 'fontColorBlue'], border: [ false, false, false, false ]
													},
													{
														text: 'Lugar', style: ['header3', 'fontColorBlue'], alignment: 'rigth', border: [ false, false, false, false ]
													},
													{
														text: 'Guadalajara, Jal', style: ['header3', 'fontColorBlue'], alignment: 'rigth', border: [ false, false, false, false ]
													}
												]
											]
										}
									},
									{ text: '\n' },
									{
										layout: {
											paddingLeft: function (i, node) { return 1; },
											paddingRight: function (i, node) { return 1; },
											paddingTop: function (i, node) { return 1; },
											paddingBottom: function (i, node) { return 0; },
										},
										table: {
											widths: [ '12%', '10%', '10%', '10%', '10%', '10%', '13%', '25%' ],
											body: [
												[
													{
													colSpan: 8, text: 'DATOS DEL CLIENTE:', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'], border: [ false, false, false, false ]
													}, '', '', '', '', '', '', ''
												],
											[
												{
												colSpan: 8, text: ' ',fontSize: 3.5, border: [ false, false, false, false ] 
												}, '', '', '', '', '', '', ''
											],
											[
												{
													colSpan: 2, text: 'Razón Social:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},'',
												{
													colSpan: 6, text: datosPDF.razonSocial, bold: true, style: ['fontColorBlue'], fontSize: 10, border: [ false, false, false, false ]
												}, '', '', '', '',''
											],
											[
												{
													colSpan: 2, text: 'Dirección Fiscal:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},'',
												{
													colSpan: 6, text: datosPDF.detalleSucursal.direccion_fiscal, bold: false, style: ['fontBody7', 'fontColorBlue'], border: [ false, false, false, false ]
												}, '', '', '', '',''
											],
											[
												{
													colSpan: 2, text: 'RFC:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},'',
												{
													colSpan: 6, text: datosPDF.detalleSucursal.rfc, bold: false, style: ['fontBody7', 'fontColorBlue'], border: [ false, false, false, false ]
												}, '', '', '', '',''
											],
											[ { colSpan: 8, text: ' ', bold: true, style: ['fontColorBlue'], fontSize: 4, border: [ false, false, false, false ] } ],
											[
												{ 
													text: 'No ECO:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},
												{
													colSpan: 2, text: datosPDF.detalleSucursal.no_economico, bold: false, style: ['fontBody7', 'fontColorBlue'],
												},'', 
												{
													text: 'CANAL:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},
												{ 
													text: datosPDF.canal, bold: false, style: ['fontBody7', 'fontColorBlue']
												}, 
												{
													text: 'TIENDA:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},
												{
													colSpan: 2, text: datosPDF.detalleSucursal.tienda, bold: false, style: ['fontBody7', 'fontColorBlue']
												},''
											],
											[ { colSpan: 8, text: ' ', bold: true, style: ['fontColorBlue'], fontSize: 3, border: [ false, false, false, false ] } ],
											[
												{
													text: 'ZONA:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},
												{
													colSpan: 2, text: datosPDF.detalleSucursal.zona, bold: false, style: ['fontBody7', 'fontColorBlue'],
												},'', 
												{
													colSpan: 2,text: '', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												},'', 
												{
													text: 'TK:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
												}, 
												{
													colSpan: 2, text: datosPDF.tk, bold: false, style: ['fontBody7', 'fontColorBlue']
												},''
											],
											[ { colSpan: 8, text: ' ', bold: true, style: ['fontColorBlue'], fontSize: 3, border: [ false, false, false, false ] } ],
												[
													{
														text: 'OT:', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
													},
													{
														colSpan: 2, text: datosPDF.ot, bold: false, style: ['fontBody7', 'fontColorBlue'],
													},'', 
													{
														colSpan: 2,text: '', bold: true, style: ['fontBody8', 'fontColorBlue'], border: [ false, false, false, false ]
													},'', 
													{
														text: 'FOLIO INT:', bold: true,
														style: ['fontBody8', 'fontColorBlue'],
														border: [ false, false, false, false ]
													}, 
													{
														colSpan: 2, text: datosPDF.folioInt, bold: false, style: ['fontBody7', 'fontColorBlue']
													},''
												]
											]
										}
									},
									{ text: '\n' },
									{
										layout: {
											paddingLeft: function (i, node) { return 1; },
											paddingRight: function (i, node) { return 1; },
											paddingTop: function (i, node) { return 1; },
											paddingBottom: function (i, node) { return 0; },
										},
										table: {
											widths: [ '10%', '10%', '59%', '12%', '9%' ],
											body: [
												[
													{
														colSpan: 5, text: 'DESCRIPIÓN DEL SERVICIO:', bold: true, style: ['fontBody', 'fontColorWhite', 'fillRowColor'], border: [ false, false, false, false ]
													}, '', '', '', ''
												],
												[
													{
													colSpan: 5, style: ['fontBody7_5', 'fontColorBlue'], text: 'POR ESTE MEDIO PONEMOS A SU AMABLE CONSIDERACION EL SIGUIENTE PRESUPUESTO REFERENTE A LOS TRABAJOS DE MANTENIMIENTOS (CORRECTIVO,INSTALACION ó PREVENTIVO) SOLICITADOS:', border: [ false, false, false, false ], alignment: 'center'
													}, '', '', '', ''
												],
												[ { colSpan: 5, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 0, border: [ false, false, false, false ] } ],
												[
													{
														text: 'CODIGO', bold: true, alignment: 'center', style: ['fontBody8', 'fontColorWhite', 'fillRowColor']
													},
													{
														text: 'QTY', bold: true, alignment: 'center', style: ['fontBody7', 'fontColorWhite', 'fillRowColor'],
													},
													{
														text: 'CONCEPTO', bold: true, alignment: 'center', style: ['fontBody8', 'fontColorWhite', 'fillRowColor'],
													}, 
													{
														text: 'P. UNITARIO', bold: true, alignment: 'center', style: ['fontBody8', 'fontColorWhite', 'fillRowColor'],
													},
													{
														text: 'IMPORTE', bold: true, alignment: 'center', style: ['fontBody8', 'fontColorWhite', 'fillRowColor'],
													},
												],
												[ { colSpan: 5, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 1, border: [ false, false, false, false ] } ]
											]
										}
									},
									{
										layout: {
											paddingLeft: function (i, node) { return 1; },
											paddingRight: function (i, node) { return 1; },
											paddingTop: function (i, node) { return 3; },
											paddingBottom: function (i, node) { return 3; },
										},
										table: {
											widths: [ '10%', '10%', '59%', '12%', '9%' ],
											body: productoServicioDetalleCot(datosPDF)
										}
									},
									{
										layout: {
											paddingLeft: function (i, node) { return 1; },
											paddingRight: function (i, node) { return 1; },
											paddingTop: function (i, node) { return 1; },
											paddingBottom: function (i, node) { return 0; },
										},
										table: {
											widths: [ '10%', '10%', '59%', '12%', '9%' ],
											body: [
												[ { colSpan: 5, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 7, border: [ false, false, false, false ] }, '', '', '', '' ],
												[
													{
														text: 'NOTA:', bold: false, alignment: 'right', style: ['fontBody', 'fontColorBlue'], italics: true, border: [ false, false, false, false ]
													},
													{
														colSpan: 2, rowSpan: 3, text: 'LA PRESENTE COTIZACION ES EN MONEDA NACIONAL.\n\nEN CASO DE SER AUTORIZADA, LOS TRABAJOS SOLICITADOS SE INICIAN AL MOMENTO QUE SE RECIBA LA O.T.', bold: false, style: ['fontColorBlue'], fontSize: 5, border: [ false, false, false, false ]
													},'', 
													{
														text: 'SUBTOTAL', bold: true, alignment: 'right', style: ['fontBody', 'fontColorBlue']
													},
													{
														text: '$' + datosPDF.ttlsServicios.subtotal, bold: true, alignment: 'right', style: ['fontBody7', 'fontColorBlue']
													}
												],
												[
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] },
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] },
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] }, 
													{
														text: 'VIÁTICOS', bold: true, alignment: 'right', style: ['fontBody', 'fontColorBlue']
													},
													{
														text: '$' + datosPDF.ttlsServicios.viaticos, bold: true, alignment: 'right', style: ['fontBody7', 'fontColorBlue']
													}
												],
												[
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] },
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] },
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] }, 
													{
														text: 'SUBTOTAL', bold: true, alignment: 'right', style: ['fontBody', 'fontColorBlue']
													},
													{
														text: '$'+ datosPDF.ttlsServicios.subttlviat, bold: true, alignment: 'right', style: ['fontBody7', 'fontColorBlue']
													}
												],
												[
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] },
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] },
													{ text: '', bold: false, style: ['fontBody', 'fontColorBlue'],border: [ false, false, false, false ] }, 
													{
														text: '16 % I.V.A.', bold: true, alignment: 'right', style: ['fontBody', 'fontColorBlue']
													},
													{
														text: '$' + formatearCarntidad2Dig((datosPDF.ttlsServicios.subttlviat * datosPDF.ttlsServicios.iva)), bold: true, alignment: 'right', style: ['fontBody7', 'fontColorBlue']
													}
												],
												[
													{
													colSpan: 3, text: '', bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], border: [ false, false, false, false ]
													//colSpan: 3, text: '#¿NOMBRE?', bold: false, alignment: 'center', style: ['fontBody', 'fontColorBlue'], border: [ false, false, false, false ]
													},'','', 
													{
														text: 'TOTAL', bold: true, alignment: 'right', style: ['fontBody', 'fontColorBlue']
													},
													{
														text: '$' + datosPDF.ttlsServicios.total, bold: true, alignment: 'right', style: ['fontBody7', 'fontColorBlue']
													}
												],
												[ { colSpan: 5, text: ' ', bold: false, style: ['fontColorBlue'], fontSize: 1, border: [ false, false, false, false ] }, '', '', '', '' ]
											]
										}
									},
									{
										layout: {
											paddingLeft: function (i, node) { return 1; },
											paddingRight: function (i, node) { return 1; },
											paddingTop: function (i, node) { return 1; },
											paddingBottom: function (i, node) { return 1; },
										},
										table: {
											widths: [ '9%', '9%', '9%', '9%', '9%', '11%', '11%', '11%', '4%', '8%', '10%' ],
											body: cuerpoViaticosDetalleCot(datosPDF)
										}
									},
								]
							]
						]
					}
			}],
			styles: {
				headerAddress: {
					fontSize: 9,
					bold: true,
					margin: [ 0, 0, 0, 0 ]
				},
				headerAddress2: {
					fontSize: 7,
					bold: false,
					margin: [ 0, 0, 0, 0 ]
				},
				header: {
					fontSize: 14,
					bold: true,
					margin: [ 0, 0, 0, 0 ]
				},
				header2: {
					fontSize: 12,
					bold: true,
					margin: [ 0, 0, 0, 0 ]
				},
				header3: { fontSize: 11, bold: true },
				fontBody: { fontSize: 6.5 },
				fontBody7: { fontSize: 7 },
				fontBody7_5: { fontSize: 7.5 },
				fontBody8: { fontSize: 8 },
				fontColorBlue: { color: '#001040' },
				fontColorWhite: { color: '#FFFFFF' },
				fillRowColor:{ fillColor: '#001040' },
				subheader: {
					fontSize: 16,
					bold: true,
					margin: [ 0, 10, 0, 5 ]
				},
				tableExample: { margin: [ 0, 5, 0, 15 ] },
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				}
			},
			defaultStyle: { /*alignment: 'justify'*/ }
		}

		// Llamar al método para crear el PDF con la información almacenada en la variable dd
		pdfMake.createPdf(dd).open();
	};
}

/**
 * Función principal para la creación de PDFs para Actas
 * @param datosPDF 
 */
export function pdfAcuseActas(datosPDF: any) {
	datosPDF.tablaviaticos = [];
	var myImage = new Image(100, 200);
	myImage.src = environment.LogoImg;
	
	let extencionImg = environment.LogoImg.split(".")[environment.LogoImg.split(".").length -1];
	
	myImage.onload = function () {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
	
		canvas.height = myImage.naturalHeight;
		canvas.width = myImage.naturalWidth;
		ctx.drawImage(myImage, 0, 0);
	
		var uri = canvas.toDataURL('image/' + extencionImg), b64 = uri;
		pdfMake.vfs = pdfFonts.pdfMake.vfs;

		var dd = {
			content: [
				{ text:' ' },
				{
					style: 'tableMargin',
					table: {
						widths: ['29%', '11%', '40%', '10%', '10%'],
						body: [
							[
								{
									image: 'data:image/jpeg;base64,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',
									width: 100,
									height: 38,
									alignment: 'center',
									rowSpan: 2
								},
								{ text: 'DOCUMENTO', fontSize: 8, alignment: 'center', margin:[0,6,0,7] },
								{ text: 'FORMATO ACUSE DE ACTAS', fontSize: 8, alignment: 'center', margin:[0,6,0,7] },
								{ text: 'CÓDIGO', fontSize: 8, alignment: 'center', margin:[0,6,0,7] },
								{ text: 'APS-F-01', fontSize: 8, alignment: 'center', margin:[0,6,0,7] }
							],
							[
								{ text: '' },
								{ text: 'PROCESO', fontSize: 8, alignment: 'center' },
								{ text: 'CONTROL DE ACTAS', fontSize: 8, alignment: 'center' },
								{ text: 'VERSIÓN', fontSize: 8, alignment: 'center' },
								{ text: '0', fontSize: 8, alignment: 'center' }
							]
						]
					},
					layout: {
						hLineWidth: function (i, node) { return 1.5; },
						vLineWidth: function (i, node) { return 1.5; }
					}
				},
				{
					margin: [0,0,35,0],
					table: {
						widths: ['100%'],
						body: [
							[{text: '', border:[false,false,false,false]}],
							[{text: '', border:[false,false,false,false]}],
							[
								{ text: obtenerFechaActual(), fontSize: 10, bold: true, alignment: 'right', border:[false,false,false,false] },
							],
							[{text: '', border:[false,false,false,false]}],
							[{text: '', border:[false,false,false,false]}]
						]
					}
				},
				{
					table: {
						widths: ['100%'],
						body: [
							[
								{ text: 'DESGLOSE', fontSize: 10, bold: true, alignment: 'center', border:[false,false,false,false] }
							]
						]
					}
				},
				{
					style: 'tableMargin',
					table: {
						widths: ['20%', '20%', '20%', '40%'],
						body: SolicitudActasDetalle(datosPDF)
					},
					layout: {
						hLineWidth: function (i, node) { return 1.5; },
						vLineWidth: function (i, node) { return 1.5; }
					}
				},
				{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },
				{ 
					fontSize: 10, alignment: 'justify',
					text: [
						'Por medio del presente documento el empleado, ',
						{text: datosPDF.nombreEmpleado, bold: true},
						' de la empresa ',
						{text:'Armstrong Prívate Security de México S.A. de C.V.', bold: true},
						' hace constar que he recibido la cantidad de Actas o Block(s) y numero consecutivo de folio(s) que se menciona en la descripción.'
					] 
				},
				{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },
				{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },
				{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },{ text: ' ', fontSize: 10 },
				
				{
					table: {
						widths: ['30%', '40%', '30%'],
						body: [
							[
								{text: '', border:[false,false,false,false]},
								{ text: 'Recibe', fontSize: 11, bold: true, alignment: 'center', border:[false,false,false,false] },
								{text: '', border:[false,false,false,false]},
							],
							[
								{text: '', border:[false,false,false,false]},
								{ text: '', border:[false,false,false,true], margin: [0,45,0,0]},
								{text: '', border:[false,false,false,false]},
							],
							[
								{text: '', border:[false,false,false,false]},
								{ text: datosPDF.nombreEmpleado, fontSize: 11, bold: true, alignment: 'center', border:[false,false,false,false] },
								{text: '', border:[false,false,false,false]},
							]
						]
					}
				},
			],
			styles: {
				tableMargin: { margin: [10, -3, 10, 15] },
				tableHeader: {
					bold: true,
					fontSize: 10,
					color: 'black',
					alignment: 'center',
					fillColor: '#8db4e2'
				},
				tableContent: {
					fontSize: 10,
					color: 'black',
					alignment: 'center'
				}
			}
		}

		// Llamar al método para crear el PDF con la información almacenada en la variable dd
		pdfMake.createPdf(dd).open();
	};
}