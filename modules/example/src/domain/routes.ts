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
			{
				headers: [],
				method: EHttpMethods.GET,
				path: 'ciudades',
				private: false,
				schema: { [EVersions.alpha]: {} },
			},
		],
		puerto: domainKeys.modulos.example.puerto,
		versions: [EVersions.alpha, EVersions.beta],
	};
}
