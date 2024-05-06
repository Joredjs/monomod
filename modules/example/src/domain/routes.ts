import {
	EHttpMethods,
	EVersions,
	IRouteGroup,
	domainKeys,
} from '@nxms/core-main/domain';

export class ExampleRoutes<TFwParams> {
	rutas: IRouteGroup<TFwParams> = {
		cors: [],
		group: 'example',
		headers: [],
		paths: [
			// vacía: no se ha creado el metodo en el port
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'vacia',
				private: false,
				schema: { [EVersions.alpha]: {} },
			},
			// noschema: No existe schema para la version
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'noschema',
				private: false,
				schema: {},
			},
			// test: Ejecuta el usecase
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'test',
				private: false,
				schema: { [EVersions.alpha]: {} },
			},
		],
		puerto: domainKeys.modulos.example.puerto,
		versions: [EVersions.alpha, EVersions.beta],
	};
}
