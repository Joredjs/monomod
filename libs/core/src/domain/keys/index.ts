import { errores } from './errores';
import { headersPrefix } from './headers';
import { httpCodes } from './http';
import { patterns } from './patterns';

// Const globalCors: RegExp[] = [/mysubdomain\.mydomain\.com$/];

// const allowedDomains: string[] = ['https://mysubdomain.mydomain.com'];

export const domainKeys = {
	core: {
		cors: {
			origin: 'mydomain.com',
		},
		crypto: {
			defaultAuthTagLength: 16,
			defaultBytes: 8,
			key: '',
		},
		pagination: {
			limit: 100,
			start: '',
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
	patterns,
	storage: {
		user: 'xrt-q23e',
	},
};
