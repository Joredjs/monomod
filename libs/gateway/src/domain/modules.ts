import { schemas } from './schemas';
import { EVersions, TDomainGroups, TModules } from '@nxms/core/domain';

console.debug('SMS', EVersions);

export const puertos: { [domain in TDomainGroups]: number } = {
	example: 11001,
};

// Listado de modulos a exponer

export const modulesList: TDomainGroups[] = ['example'];

export const modulos: TModules = {
	example: {
		name: 'example',
		puerto: puertos.example,
		schemas,
		versions: ['v1'],
	},
};
