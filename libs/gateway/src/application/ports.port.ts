import {
	IPort,
	IPortParams,
	IPortResponseResult,
	IServices,
	TDomainGroups,
	TExternalUseCases,
	TMyModulesInstances,
	TPorts,
} from '@monomod/core/domain';
import { modulesList } from '../domain';
import { normalizeError } from '@monomod/core/application';
export class PortPorts {
	#services: IServices = {};

	#modulesInstances: TMyModulesInstances;

	#response: IPortResponseResult;

	#externalUseCasesList: TExternalUseCases = {};

	constructor(
		services: IServices,
		modulesInstances: TMyModulesInstances,
		response: IPortResponseResult
	) {
		this.#modulesInstances = modulesInstances;
		this.#response = response;
		this.#services = services;
	}

	// Factory method to create a port instance for a specific module
	#createPort(module: TDomainGroups): IPort {
		const params: IPortParams = {
			externalUseCases: this.#externalUseCasesList,
			response: this.#response,
			services: this.#services,
		};
		return new this.#modulesInstances[module].Port(params);
	}

	#setExternalUseCases(module: TDomainGroups, businessPort: IPort) {
		this.#externalUseCasesList[module] = businessPort.getPublicUseCases();
	}

	// Get all ports, dynamically creating them for each module
	getAll(): TPorts {
		const ports: TPorts = {};
		for (const module of modulesList) {
			if (!this.#modulesInstances[module]) {
				throw normalizeError({
					detail: module,
					errType: 'invalid',
					text: 'The module instace doesn´t exists.',
				});
			}
			ports[module] = this.#createPort(module);
			this.#setExternalUseCases(module, ports[module]);
		}

		return ports;
	}
}
