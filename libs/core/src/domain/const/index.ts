// Import { HEADERPREFIX } from './headers.const';

// Const globalCors: RegExp[] = [/mysubdomain\.mydomain\.com$/];

// const allowedDomains: string[] = ['https://mysubdomain.mydomain.com'];

// TODO: improve domainKeys file structure

/* export const domainKeys = {
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
   	storage: {
   		user: 'xrt-q23e',
   	},
   }; */

export * from './defaults.const';
export * from './errors.const';
export * from './headers.const';
export * from './http.const';
export * from './messages.const';
export * from './modules.const';
export * from './patterns.const';
export * from './symbols.const';
export * from './translations.const';
