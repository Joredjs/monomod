import {
	IPortParams,
	IServices,
	TDomainGroups,
	TMyModulesInstances,
	TPorts,
	setError,
} from '@nxms/core/domain';
import { modulesList } from '../domain';
export class PortPorts {
	#services: IServices = {};

	#modulesInstances: TMyModulesInstances;

	constructor(services: IServices, modulesInstances: TMyModulesInstances) {
		this.#modulesInstances = modulesInstances;
		this.#services = services;
	}

	// Factory method to create a port instance for a specific module
	#createPort(module: TDomainGroups) {
		const params: IPortParams = {
			services: this.#services,
		};
		return new this.#modulesInstances[module].Port(params);
	}

	// Get all ports, dynamically creating them for each module
	getAll(): TPorts {
		const ports: TPorts = {};
		for (const module of modulesList) {
			if (!this.#modulesInstances[module]) {
				throw setError({
					detail: module,
					errType: 'invalid',
					text: 'The module instace doesn´t exists.',
				});
			}
			ports[module] = this.#createPort(module);
		}

		return ports;
	}
}
