import {
	IModuleRoute,
	IRouteGroup,
	TDomainGroups,
	domainKeys,
} from '@nxms/core/domain';

import { modulesList, modulos } from '../domain';
import { ExampleRoutes } from '@nxms/module-example/domain';

type TMyModuleRoute<TFwParams> = {
	[domain in TDomainGroups]?: IModuleRoute<TFwParams>;
};
export class PortRoutes<TFwParams> {
	example: IModuleRoute<TFwParams>;

	#modules: TMyModuleRoute<TFwParams> = {};

	constructor() {
		// TODO: obtener los modules de forma más dinámica
		this.example = new ExampleRoutes(modulos.example);
	}

	#addGlobalCors(ruta: IRouteGroup<TFwParams>) {
		ruta.cors.concat(domainKeys.core.globalCors);
		// TODO: Si los dominios no se configuran cada ruta, moverlo a un lugar más general
		ruta.domains = domainKeys.core.allowedDomains;
		return ruta;
	}

	routeList(): IRouteGroup<TFwParams>[] {
		const rutas: IRouteGroup<TFwParams>[] = [];
		for (const module of modulesList) {
			this.#setModulesRoutes(module);
			const paths = this.#modules[module].getRutas();
			rutas.push(this.#addGlobalCors(paths));
		}

		return rutas;
	}

	#setModulesRoutes(module: TDomainGroups) {
		this.#modules[module] = this[module];
	}
}
