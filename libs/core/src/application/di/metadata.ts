export const INJECT_METADATA_KEY = Symbol('INJECT_METADATA_KEY');
export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_METADATA_KEY');
export const PROVIDER_METADATA_KEY = Symbol('PROVIDER_METADATA_KEY');

export interface PropertyMetadata {
	propertyKey: string | symbol;
	token: symbol;
}

export interface ProviderMetadata {
	token: symbol;
	implementation: any;
}
