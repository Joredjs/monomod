import {
	EHttpMethods,
	EPrivacyLevel,
	EVersions,
	IModule,
	IRouteGroup,
	IRuta,
	TDomainGroups,
} from '@nxms/core-main/domain';

export class ExampleRoutes<TFwParams, TGTMod extends TDomainGroups> {
	#modulo: IModule<TGTMod>;

	constructor(modulo: IModule<TGTMod>) {
		this.#modulo = modulo;
	}

	#getPaths(): IRuta[] {
		return [
			// vacía: no se ha creado el metodo en el port
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'vacia',
				privacy: [EPrivacyLevel.public],
				schema: this.#modulo.schemas.empty,
			},
			// noschema: No existe schema para la version
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'noschema',
				privacy: [EPrivacyLevel.public],
				schema: {},
			},
			// test: Ejecuta el usecase
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
			versions: this.#modulo.versions,
		};
	}
}
