import { HEADERPREFIX } from './const';
import { IHeadersInfo } from './interfaces';

/* TODO: mover a const
   TODO: Change to const instead class */
export class DataHeaders {
	headers: IHeadersInfo = {
		crdata: {
			desc: 'Información (codificada) a encriptar',
			key: 'crdata',
			mandatory: false,
			prefix: HEADERPREFIX.v2,
		},
		so: {
			desc: 'Sistema operativo',
			key: 'so',
			mandatory: true,
			prefix: HEADERPREFIX.v1,
			values: ['web', 'android', 'ios'],
		},
		token: {
			desc: 'Token de session',
			key: 'tk',
			prefix: HEADERPREFIX.v2,
		},
		up: {
			desc: 'Usuario y contraseña encriptado',
			key: 'up',
			mandatory: false,
			prefix: HEADERPREFIX.v1,
		},
	};
}
