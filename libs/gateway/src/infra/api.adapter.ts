import {
	IDomainGroup,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IServices,
	IServicesDependencies,
	TMyModulesInstances,
} from '@nxms/core/domain';
import {
	ModuleExampleController,
	ModuleExamplePort,
	ModuleExampleRoutes,
} from '@nxms/module-example';
import {
	PortControllers,
	PortPorts,
	PortRoutes,
	ServiceLayers,
} from '../application';
import {
	ServiceCrypto,
	ServiceEncode,
	ServiceHeaders,
	ServiceMail,
	ServiceSchema,
	ServiceUseCases,
	normalizeError,
} from '@nxms/core/application';
import { clientCrypto, clientMailer, clientSchema } from './dependencies';

export class AdapterApi<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#domainList: IDomainGroup<TFwParams>[] = [];

	#services: IServices = {};

	#layersService;

	// TODO: create new instaces here ??
	#modulesInstances: TMyModulesInstances = {
		example: {
			Controller: ModuleExampleController,
			Port: ModuleExamplePort,
			Route: ModuleExampleRoutes,
		},
	};

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		try {
			this.#setServices();

			const controllers = new PortControllers<TFwReq, TFwRes>(
				frameworkService,
				this.#modulesInstances
			);
			const ports = new PortPorts(this.#services, this.#modulesInstances);
			this.#layersService = new ServiceLayers<TFwReq, TFwRes>(
				controllers.getAll(this.#services),
				ports.getAll()
			);
			const routes = new PortRoutes<TFwParams>(this.#modulesInstances);
			this.#domainList = routes.getAll();
		} catch (error) {
			throw normalizeError(error);
		}
	}

	getDomainGroups(): IDomainGroup<TFwParams>[] {
		return this.#domainList.map((domGroup) => ({
			...domGroup,
			businessPort: this.#layersService.getPort(domGroup.name),
			handler: this.#layersService.getController(domGroup.name).handler,
		}));
	}

	#setServices() {
		const dependencies: IServicesDependencies = this.#getDependencies();

		this.#services.crypto = new ServiceCrypto(dependencies.crypto.client);
		this.#services.encode = new ServiceEncode();
		this.#services.headers = new ServiceHeaders(this.#services.crypto);
		this.#services.mail = new ServiceMail(dependencies.mail.client);
		this.#services.useCases = new ServiceUseCases();
		this.#services.schema = new ServiceSchema(dependencies.schema.client);
	}

	#getDependencies() {
		return {
			crypto: { client: clientCrypto },
			mail: { client: clientMailer },
			schema: { client: clientSchema },
		};
	}
}
