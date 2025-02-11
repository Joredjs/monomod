import {
	IDomainGroup,
	IModuleRoute,
	TDomainGroups,
	TMyModulesInstances,
} from '@monomod/core/domain';
import { modulesList, modulos } from '../domain';
import { normalizeError } from '@monomod/core/application';

export class PortRoutes {
	#modulesInstances: TMyModulesInstances;

	constructor(modulesInstances: TMyModulesInstances) {
		this.#modulesInstances = modulesInstances;
	}

	// Factory method to create a route instance for a specific module
	#createModuleRoutes(module: TDomainGroups): IModuleRoute {
		return new this.#modulesInstances[module].Route(modulos[module]);
	}

	// Get all route groups, dynamically creating them for each module
	getAll(): IDomainGroup[] {
		const routes: IDomainGroup[] = [];
		for (const module of modulesList) {
			if (!this.#modulesInstances[module]) {
				throw normalizeError({
					detail: module,
					errType: 'invalid',
					text: 'The module instace doesn´t exists.',
				});
			}

			const moduleRoutes = this.#createModuleRoutes(module);
			routes.push(moduleRoutes.getRoutes());
		}

		return routes;
	}
}
