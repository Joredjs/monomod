import { headersPrefix } from './headers.const';

// Const globalCors: RegExp[] = [/mysubdomain\.mydomain\.com$/];

// const allowedDomains: string[] = ['https://mysubdomain.mydomain.com'];

// TODO: improve domainKeys file structure

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
	headersPrefix,
	storage: {
		user: 'xrt-q23e',
	},
};

export * from './defaults.const';
export * from './errores.const';
export * from './http.const';
export * from './messages.const';
export * from './mocks';
export * from './modules.const';
export * from './patterns.const';
export * from './tokens.const';
export * from './translations.const';

