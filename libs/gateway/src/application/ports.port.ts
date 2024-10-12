import {
	IPortParams,
	IResponseResult,
	IServices,
	TDomainGroups,
	TMyModulesInstances,
	TPorts,
} from '@nxms/core/domain';
import { modulesList } from '../domain';
import { normalizeError } from '@nxms/core/application';
export class PortPorts {
	#services: IServices = {};

	#modulesInstances: TMyModulesInstances;

	#response: IResponseResult;

	constructor(
		services: IServices,
		modulesInstances: TMyModulesInstances,
		response: IResponseResult
	) {
		this.#modulesInstances = modulesInstances;
		this.#services = services;
		this.#response = response;
	}

	// Factory method to create a port instance for a specific module
	#createPort(module: TDomainGroups) {
		const params: IPortParams = {
			response: this.#response,
			services: this.#services,
		};
		return new this.#modulesInstances[module].Port(params);
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
		}

		return ports;
	}
}
