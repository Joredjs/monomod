import {
	EHttpMethods,
	EPrivacyLevel,
	IDomainGroup,
	IModule,
	IModuleRoute,
	IRoute,
} from '@monomod/core/domain';

export class ModuleExampleRoutes implements IModuleRoute {
	#modulo: IModule;

	constructor(modulo: IModule) {
		this.#modulo = modulo;
	}

	#getPaths(): IRoute[] {
		return [
			// Empty: Does not exists the handler in the businessPort
			{
				method: EHttpMethods.GET,
				path: 'empty',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.empty,
			},
			// Noschema: Does not exists schema for the version
			{
				method: EHttpMethods.GET,
				path: 'noschema',
				privacy: [EPrivacyLevel.public],
				schema: {},
			},
			// Badschema: use an unexisting schema
			{
				method: EHttpMethods.POST,
				path: 'badschema',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.undefined,
			},
			// Test: executes the success usecase
			{
				method: EHttpMethods.GET,
				path: 'testok',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.empty,
			},
			// Test: executes the success usecase but it require user authetication
			{
				method: EHttpMethods.GET,
				path: 'testok/admin',
				privacy: [EPrivacyLevel.admin],
				schema: this.#modulo.schemas.empty,
			},
			// Error: executes the failure error usecase
			{
				method: EHttpMethods.GET,
				path: 'testerror',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.empty,
			},
		];
	}

	getRoutes(): IDomainGroup {
		return {
			cors: this.#modulo.cors,
			headers: [],
			httpPort: this.#modulo.httpPort,
			name: this.#modulo.name,
			paths: this.#getPaths(),
			versions: this.#modulo.versions,
		};
	}
}
