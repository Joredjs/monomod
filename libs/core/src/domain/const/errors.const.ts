import { HTTPCODES } from './http.const';
import { TErrores } from '../interfaces';

export const ERRORS: TErrores = {
	alreadyExists: {
		code: HTTPCODES[409].code,
		desc: 'Ya existe esta información',
		text: 'La acción que intentas realizar no está permitida',
	},
	badConfigured: {
		code: HTTPCODES[417].code,
		desc: 'Error en la configuración',
		text: 'El servidor está mal configurado',
	},
	badInfo: {
		code: HTTPCODES[412].code,
		desc: 'La información enviada no es correcta',
		text: 'Verifica la información ingresada',
	},
	badUser: {
		code: HTTPCODES[404].code,
		desc: 'Las credenciales están mal',
		text: 'El código ingresado es incorrecto. Por favor verifíquelo e inténtelo de nuevo.',
	},
	forbidden: {
		code: HTTPCODES[403].code,
		desc: 'Acción prohibida',
		text: 'La acción que intentas realizar no está permitida',
	},
	gone: {
		code: HTTPCODES[410].code,
		desc: 'Lo que intenta ejecutar no existe',
		text: 'Al parecer lo que intentas hacer no existe',
	},
	headers: {
		code: HTTPCODES[428].code,
		desc: 'No se envían los headers necesarios',
		text: 'Verifica la información ingresada',
	},
	invalid: {
		code: HTTPCODES[406].code,
		desc: 'Datos incorrectos',
		text: 'Los datos que ingresaste no son válidos',
	},
	noInfo: {
		code: HTTPCODES[404].code,
		desc: 'Información no encontrada',
		text: 'La información no se encuentra disponible',
	},
	nocatch: {
		code: HTTPCODES[500].code,
		desc: 'Error indefinido, posiblemente aparece en los catch',
		text: 'No ha sido posible obtener la información.',
	},
	nodetail: {
		code: HTTPCODES[400].code,
		desc: 'No es posible ver el detalle del error',
		text: 'No está permitido ver el detalle del error',
	},
	params: {
		code: HTTPCODES[412].code,
		desc: 'No se envían los parámetros necesarios',
		text: 'Verifica la información ingresada',
	},
	session: {
		code: HTTPCODES[401].code,
		desc: 'Conflicto en la sessión',
		text: 'Por favor inicia sesio',
	},
	uncompleted: {
		code: HTTPCODES[417].code,
		desc: 'Accion incompleta',
		text: 'No ha sido posible completar la acción que intentas realizar',
	},
};
