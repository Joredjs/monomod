import { EPrivacyLevel, TDomainGroups, TVersion } from './modules';
import { ISchemaObject, TRouteSchema } from './services/schema';
import { IHeadersStructure } from './validations';
import { IPort } from './layers';
import { THttpMethods } from './http';

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

export interface IModuleRoute {
	getRoutes(): IDomainGroup;
}

// TODO: dont use any (use class instance)
export type TMyModulesInstances = {
	[domain in TDomainGroups]: {
		Controller: any;
		Port: any;
		Route: any;
	};
};
