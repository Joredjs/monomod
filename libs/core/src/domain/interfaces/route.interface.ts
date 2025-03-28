import { EPrivacyLevel, TDomainGroups, TVersion } from '../const';
import { ISchemaObject, TRouteSchema } from './schema.interface';
import { IHeadersStructure } from './validations.interface';
import { IPort } from '../ports';
import { THttpMethods } from './http.interface';

export interface IRoute {
	businessPort?: IPort;
	globalHeaders?: string[];
	headers?: string[];
	method: THttpMethods;
	path: string;
	privacy: EPrivacyLevel[];
	schema?: TRouteSchema;
	version?: TVersion;
}

export interface ICorsInfo {
	dnsDomains: string[];
	localhostAllowed: boolean;
	noOriginAllowed: boolean;
}

export interface IDomainGroup {
	businessPort?: IPort;
	cors: ICorsInfo;
	handler?(req, res, next): void | Promise<void>;
	headers: string[];
	httpPort: number;
	name: TDomainGroups;
	paths: IRoute[];
	versions: TVersion[];
}

export interface IModule {
	cors: ICorsInfo;
	headers?: { [head: string]: IHeadersStructure };
	httpPort: number;
	name: TDomainGroups;
	schemas: ISchemaObject;
	useValidations: boolean;
	versions: TVersion[];
}

export type TModules = {
	[mod in TDomainGroups]: IModule;
};

// TODO: dont use any (use class instance)
export type TMyModulesInstances = {
	[domain in TDomainGroups]: {
		Controller: any;
		Port: any;
		Route: any;
	};
};
