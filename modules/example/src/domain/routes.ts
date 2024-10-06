import {
	EHttpMethods,
	EPrivacyLevel,
	IModule,
	IModuleRoute,
	IRouteGroup,
	IRuta,
	TDomainGroups,
} from '@nxms/core/domain';

export class ModuleExampleRoutes<TFwParams> implements IModuleRoute<TFwParams> {
	#modulo: IModule;

	constructor(modulo: IModule) {
		this.#modulo = modulo;
	}

	#getPaths(): IRuta[] {
		return [
			// Vacía: no se ha creado el metodo en el port
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'vacia',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.empty,
			},
			// Noschema: No existe schema para la version
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'noschema',
				privacy: [EPrivacyLevel.public],
				schema: {},
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

	getRutas(): IRouteGroup<TFwParams> {
		return {
			cors: [],
			group: this.#modulo.name,
			headers: [],
			paths: this.#getPaths(),
			puerto: this.#modulo.puerto,
			// Services: this.#modulo.services,
			versions: this.#modulo.versions,
		};
	}
}
