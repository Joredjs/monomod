import {
	EHttpMethods,
	EPrivacyLevel,
	IModule,
	IRouteGroup,
	IRuta,
	TDomainGroups,
} from '@nxms/core/domain';

export class ModuleExampleRoutes<TFwParams, TGTMod extends TDomainGroups> {
	#modulo: IModule<TGTMod>;

	constructor(modulo: IModule<TGTMod>) {
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
			// Test: Ejecuta el usecase
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'test',
				privacy: [EPrivacyLevel.user],
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
