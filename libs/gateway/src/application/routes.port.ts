import {
	IModuleRoute,
	IRouteGroup,
	TDomainGroups,
	TMyModulesInstances,
	domainKeys,
} from '@nxms/core/domain';
import { modulesList, modulos } from '../domain';

export class PortRoutes<TFwParams> {
	#modulesInstances: TMyModulesInstances;

	constructor(modulesInstances: TMyModulesInstances) {
		this.#modulesInstances = modulesInstances;
	}

	// Apply global CORS configuration to a route group
	#applyGlobalCors(route: IRouteGroup<TFwParams>): IRouteGroup<TFwParams> {
		return {
			...route,
			cors: route.cors.concat(domainKeys.core.globalCors),
			// TODO: IF the domains arent configured per route, move it to a generic place
			domains: domainKeys.core.allowedDomains,
		};
	}

	// Factory method to create a route instance for a specific module
	#createModuleRoutes(module: TDomainGroups): IModuleRoute<TFwParams> {
		return new this.#modulesInstances[module].Route(modulos[module]);
	}

	// Get all route groups, dynamically creating them for each module
	getAll(): IRouteGroup<TFwParams>[] {
		const routes: IRouteGroup<TFwParams>[] = [];
		for (const module of modulesList) {
			const moduleRoutes = this.#createModuleRoutes(module);
			routes.push(this.#applyGlobalCors(moduleRoutes.getRutas()));
		}

		return routes;
	}
}
