import { IPortParams, IServices, TPorts } from '@nxms/core-main/domain';
import {
	ServiceCrypto,
	ServiceEncode,
	ServiceHeaders,
	ServiceMail,
	ServiceUseCases,
} from '@nxms/core-main/application';
import { clientCrypto, clientMailer } from '../infra/dependencies';
import { DataHeaders } from '../domain';
import { PortExample } from '@nxms/module-example/application';
export class AdapterPorts {
	services: IServices = {};

	constructor() {
		const infoHeaders = new DataHeaders();

		this.services.crypto = ServiceCrypto.getInstance(clientCrypto);
		this.services.encode = new ServiceEncode();
		this.services.headers = ServiceHeaders.getInstance(
			infoHeaders.headers,
			this.services.crypto
		);
		this.services.mail = new ServiceMail(clientMailer);
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
