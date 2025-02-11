import { TLanguage } from '../interfaces';

const defaultLanguage: TLanguage = 'en';
const defaultLanguages: TLanguage[] = ['en', 'es'];

export const DEFAULTS = {
	cors: {
		origin: 'mydomain.com',
	},
	crypto: {
		authTagLength: 16,
		bytes: 8,
		key: '',
	},
	language: defaultLanguage,
	languages: defaultLanguages,
};
