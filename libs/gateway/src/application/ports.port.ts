import {
	IPortParams,
	IServices,
	TDomainGroups,
	TMyModulesInstances,
	TPorts,
} from '@nxms/core/domain';
import { modulesList } from '../domain';
export class PortPorts {
	#services: IServices = {};

	#modulesInstances: TMyModulesInstances;

	constructor(services: IServices, modulesInstances: TMyModulesInstances) {
		this.#modulesInstances = modulesInstances;
		this.#services = services;
	}

	getAll(): TPorts {
		const ports: TPorts = {};
		for (const module of modulesList) {
			const myPort = this.#setModulePort(module);
			ports[module] = myPort;
		}

		return ports;
	}

	#setModulePort(module: TDomainGroups) {
		const params: IPortParams = {
			services: this.#services,
		};
		return new this.#modulesInstances[module].Port(params);
	}
}
