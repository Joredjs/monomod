import { IHeadersInfo } from './validations';
import { domainKeys } from './keys';

// Global project headers
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
