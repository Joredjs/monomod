import { errores } from './errores';
import { headersPrefix } from './headers';
import { httpCodes } from './http';
import { patterns } from './patterns';
import { translations } from './translations';

// Const globalCors: RegExp[] = [/mysubdomain\.mydomain\.com$/];

// const allowedDomains: string[] = ['https://mysubdomain.mydomain.com'];

export const domainKeys = {
	core: {
		container: {
			frameworkconfig: Symbol('frameworkconfig'),
		},
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
	i18n: {
		allowedLanguages: ['en', 'es', 'it'],
		defaultLanguage: 'en',
		translations,
	},
	patterns,
	storage: {
		user: 'xrt-q23e',
	},
};
