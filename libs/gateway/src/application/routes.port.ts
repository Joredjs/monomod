import {
	IDomainGroup,
	IModuleRoute,
	TDomainGroups,
	TMyModulesInstances,
	domainKeys,
} from '@nxms/core/domain';
import { modulesList, modulos } from '../domain';
import { normalizeError } from '@nxms/core/application';

export class PortRoutes<TFwParams> {
	#modulesInstances: TMyModulesInstances;

	constructor(modulesInstances: TMyModulesInstances) {
		this.#modulesInstances = modulesInstances;
	}

	// Apply global CORS configuration to a route group
	#applyGlobalCors(route: IDomainGroup<TFwParams>): IDomainGroup<TFwParams> {
		return {
			...route,
			cors: route.cors.concat(domainKeys.core.globalCors),
			// TODO: IF the domains arent configured per route, move it to a generic place
			dnsDomains: domainKeys.core.allowedDomains,
		};
	}

	// Factory method to create a route instance for a specific module
	#createModuleRoutes(module: TDomainGroups): IModuleRoute<TFwParams> {
		return new this.#modulesInstances[module].Route(modulos[module]);
	}

	// Get all route groups, dynamically creating them for each module
	getAll(): IDomainGroup<TFwParams>[] {
		const routes: IDomainGroup<TFwParams>[] = [];
		for (const module of modulesList) {
			if (!this.#modulesInstances[module]) {
				throw normalizeError({
					detail: module,
					errType: 'invalid',
					text: 'The module instace doesn´t exists.',
				});
			}

			const moduleRoutes = this.#createModuleRoutes(module);
			routes.push(this.#applyGlobalCors(moduleRoutes.getRoutes()));
		}

		return routes;
	}
}
