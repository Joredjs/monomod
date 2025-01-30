import { IHeadersInfo } from './interfaces/validations.interface';
import { domainKeys } from './const';

/* TODO: mover a const
   TODO: Change to const instead class */
export class DataHeaders {
	headers: IHeadersInfo = {
		crdata: {
			desc: 'Información (codificada) a encriptar',
			key: 'crdata',
			mandatory: false,
			prefix: domainKeys.headersPrefix.v2,
		},
		so: {
			desc: 'Sistema operativo',
			key: 'so',
			mandatory: true,
			prefix: domainKeys.headersPrefix.v1,
			values: ['web', 'android', 'ios'],
		},
		token: {
			desc: 'Token de session',
			key: 'tk',
			prefix: domainKeys.headersPrefix.v2,
		},
		up: {
			desc: 'Usuario y contraseña encriptado',
			key: 'up',
			mandatory: false,
			prefix: domainKeys.headersPrefix.v1,
		},
	};
}
