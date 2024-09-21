import { DataHeaders, modulesList } from '../domain';
import {
	IPortParams,
	IServices,
	IServicesDependencies,
	TDomainGroups,
	TMyModuleList,
	TPorts,
} from '@nxms/core/domain';
import {
	ServiceCrypto,
	ServiceEncode,
	ServiceHeaders,
	ServiceMail,
	ServiceUseCases,
} from '@nxms/core/application';
export class PortPorts {
	services: IServices = {};

	#modulesInstances: TMyModuleList;

	constructor(
		dependencies: IServicesDependencies,
		modulesInstances: TMyModuleList
	) {
		this.#modulesInstances = modulesInstances;

		const infoHeaders = new DataHeaders();

		this.services.crypto = ServiceCrypto.getInstance(
			dependencies.crypto.client
		);
		this.services.encode = new ServiceEncode();
		this.services.headers = ServiceHeaders.getInstance(
			infoHeaders.headers,
			this.services.crypto
		);
		this.services.mail = new ServiceMail(dependencies.mail.client);
		this.services.useCases = new ServiceUseCases();
	}

	// TODO: obtener los módulos de forma más dinámica

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
			services: this.services,
		};
		return new this.#modulesInstances[module].Port(params);
	}
}
