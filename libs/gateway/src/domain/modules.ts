import { EVersions, TDomainGroups, TModules } from '@monomod/core/domain';
import { schemas } from './schemas';

export const puertos: { [domain in TDomainGroups]: number } = {
	example: 11001,
};

// Module's list to be exposed

export const modulesList: TDomainGroups[] = ['example'];

export const modulos: TModules = {
	example: {
		cors: {
			dnsDomains: ['https://mysubdomain.mydomain.com'],
			localhostAllowed: true,
			noOriginAllowed: false,
		},
		httpPort: puertos.example,
		name: 'example',
		schemas,
		useValidations: true,
		versions: [EVersions.alpha],
	},
};
