import { IPort, TFrameworkParams, THttpMethods } from '.';

export type TDomainGroups = 'example';
export type THeadersVersion = 'v1' | 'v2';

export enum EVersions {
	alpha = 'v1',
	beta = 'v2',
}

type TSchemaType =
	| 'number'
	| 'integer'
	| 'string'
	| 'boolean'
	| 'array'
	| 'object'
	| null;

export interface ISchemaProperties {
	additionalProperties?: boolean;
	type?: TSchemaType;
	properties?: any;
	required?: string[];
	pattern?: string;
	errorMessage?: string | any;
	enum?: string[];
	if?: { [key: string]: any };
	then?: any;
	else?: any;
	allOf?: any;
	minimum?: number;
	maximum?: number;
}

export interface ISchema {
	[key: string]: ISchemaProperties;
}

export type TRutaSchema = {
	[index in EVersions]?: ISchema;
};

// TODO: definir niveles de acceso en vez de private

export interface IRuta {
	globalHeaders?: string[];
	headers: string[];
	method: THttpMethods;
	path: string;
	port?: IPort;
	private: boolean;
	schema: TRutaSchema;
	version?: THeadersVersion;
}

export interface IRouteGroup<TFwParams> {
	cors: RegExp[];
	group: TDomainGroups;
	handler?: TFrameworkParams<TFwParams>;
	headers: string[];
	paths: IRuta[];
	puerto: number;
	port?: IPort;
	versions: THeadersVersion[];
}
