import {
	IPortParams,
	IServices,
	IServicesDependencies,
	TPorts,
} from '@nxms/core/domain';
import {
	ServiceCrypto,
	ServiceEncode,
	ServiceHeaders,
	ServiceMail,
	ServiceUseCases,
} from '@nxms/core';
import { DataHeaders } from '../domain';
import { PortExample } from '@nxms/module-example/application';
export class PortPorts {
	services: IServices = {};

	// TODO: inject dependencies
	constructor(dependencies: IServicesDependencies) {
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
		const example = this.#getExample();
		return { example };
	}

	#getExample(): PortExample {
		const params: IPortParams = {
			services: this.services,
		};

		return new PortExample(params);
	}
}
