import { errores } from './errores';
import { headersPrefix } from './headers';
import { httpCodes } from './http';
import { modulos } from './modules';
import { patterns } from './patterns';

const globalCors: RegExp[] = [/mysubdomain\.mydomain\.com$/];

const allowedDomains: string[] = ['https://mysubdomain.mydomain.com'];

export const domainKeys = {
	core: {
		allowedDomains,
		crypto: {
			defaultAuthTagLength: 16,
			defaultBytes: 8,
			key: '',
		},
		globalCors,
		pagination: {
			limit: 100,
			start: 0,
		},
		token: {
			userinfo: {
				key: 'uit',
				name: 'userInfoToken',
			},
		},
	},
	errores,
	headersPrefix,
	httpCodes,
	modulos,
	patterns,
	storage: {
		user: 'xrt-q23e',
	},
};
