import { EVersions } from '../modules';
import { IJSONObject } from '../values';

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
	optional?: boolean;
	uniqueItems?: boolean;
	minItems?: number;
	maxItems?: number;
	items?: ISchemaProperties;
}

export interface ISchema {
	[key: string]: ISchemaProperties;
}

export type TRouteSchema = {
	[index in EVersions]?: ISchema;
};

export interface ISchemaObject {
	[key: string]: TRouteSchema;
}

export interface ISchemaClient {
	defaultOptions: any;
	errors: any;
	Validator: any;
}

export interface IServiceSchema {
	validate(schema: ISchema, keys: string[], params: IJSONObject): boolean;
}
