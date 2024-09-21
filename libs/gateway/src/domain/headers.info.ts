import { IHeadersInfo, IHeadersStructure, domainKeys } from '@nxms/core/domain';

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

	// Constructor() {
	// 	/* TODO: agregar solo del modulo que lo consume
	// 	   Add tokens de los modulos */
	// 	/* For (const mod in domainKeys.modulos) {
	// 	   	If (domainKeys.modulos[mod]) {
	// 	   		Const mymod = domainKeys.modulos[mod];
	// 	   		For (const myhead in mymod.headers) {
	// 	   			If (mymod.headers[myhead] && mymod.headers[myhead].name) {
	// 	   				This.addHeader(mymod.headers[myhead]);
	// 	   			}
	// 	   		}
	// 	   	}
	// 	   } */
	// }

	#addHeader(header: IHeadersStructure) {
		if (!this.headers[header.name]) {
			this.headers[header.name] = header;
		}
	}
}
