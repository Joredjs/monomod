import {
	EHttpMethods,
	EPrivacyLevel,
	IDomainGroup,
	IModule,
	IModuleRoute,
	IRoute,
} from '@nxms/core/domain';

export class ModuleExampleRoutes<TFwParams> implements IModuleRoute<TFwParams> {
	#modulo: IModule;

	constructor(modulo: IModule) {
		this.#modulo = modulo;
	}

	#getPaths(): IRoute[] {
		return [
			// Empty: Does not exists the handler in the businessPort
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'empty',
				privacy: [EPrivacyLevel.public],
				schema: {},
			},
			// Noschema: Does not exists schema for the version
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'noschema',
				privacy: [EPrivacyLevel.public],
				schema: {},
			},
			// Badschema: use an unexisting schema
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'badschema',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.undefined,
			},
			// Test: executes the usecase
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'test',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.empty,
			},
			// Test: executes the usecase but it require user authetication
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'test/admin',
				privacy: [EPrivacyLevel.admin],
				schema: this.#modulo.schemas.empty,
			},
		];
	}

	getRoutes(): IDomainGroup<TFwParams> {
		return {
			cors: [],
			headers: [],
			httpPort: this.#modulo.httpPort,
			name: this.#modulo.name,
			paths: this.#getPaths(),
			versions: this.#modulo.versions,
		};
	}
}
