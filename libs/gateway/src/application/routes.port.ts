import {
	IModuleRoute,
	IRouteGroup,
	TDomainGroups,
	TMyModulesInstances,
	domainKeys,
} from '@nxms/core/domain';
import { modulesList, modulos } from '../domain';

type TMyModuleRoute<TFwParams> = {
	[domain in TDomainGroups]?: IModuleRoute<TFwParams>;
};
export class PortRoutes<TFwParams> {
	example: IModuleRoute<TFwParams>;

	#modules: TMyModuleRoute<TFwParams> = {};

	#modulesInstances: TMyModulesInstances;

	constructor(modulesInstances: TMyModulesInstances) {
		this.#modulesInstances = modulesInstances;
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
		this.#modules[module] = new this.#modulesInstances[module].Route(
			modulos[module]
		);
	}
}
