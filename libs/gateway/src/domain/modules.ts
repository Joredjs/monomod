import { EVersions, TDomainGroups, TModules } from '@nxms/core/domain';
import { schemas } from './schemas';

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
		services: [],
		versions: [EVersions.alpha],
	},
};
