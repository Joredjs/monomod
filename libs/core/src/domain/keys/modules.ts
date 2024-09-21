import { IHeadersStructure } from '../validations';
import { TDomainGroups } from '../rutas';
import { puertos } from './ports';

export type TModules = {
	[mod in TDomainGroups]: {
		puerto: number;
		headers?: { [head: string]: IHeadersStructure };
	};
};

//  TODO: Validarlo con TDomainGroups

export const modulos: TModules = {
	example: {
		puerto: puertos.example,
	},
};
