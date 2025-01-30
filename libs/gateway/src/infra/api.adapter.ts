import {
	IDomainGroup,
	IPortFrameworkService,
	IPortLogs,
	IPortResponseResult,
	IRequestParams,
	IResponseParams,
	IServices,
	IServicesDependencies,
	TMyModulesInstances,
	TOKENS,
} from '@monomod/core/domain';
import {
	Inject,
	ResponseResult,
	ServiceCrypto,
	ServiceEncode,
	ServiceHeaders,
	ServiceMail,
	ServiceSchema,
	ServiceUseCases,
	normalizeError,
} from '@monomod/core/application';
import {
	ModuleExampleController,
	ModuleExamplePort,
	ModuleExampleRoutes,
} from '@monomod/module-example';
import {
	PortControllers,
	PortPorts,
	PortRoutes,
	ServiceLayers,
} from '../application';
import { clientAjv, clientCrypto, clientNodemailer } from './dependencies';

export class AdapterApi<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#domainList: IDomainGroup[] = [];

	#services: IServices = {};

	#response: IPortResponseResult;

	#layersService;

	// TODO: create new instaces here ??
	#modulesInstances: TMyModulesInstances = {
		example: {
			Controller: ModuleExampleController,
			Port: ModuleExamplePort,
			Route: ModuleExampleRoutes,
		},
	};

	constructor(frameworkService: IPortFrameworkService<TFwRes>) {
		this.#response = new ResponseResult();
		try {
			this.#setServices();

			const controllers = new PortControllers<TFwReq, TFwRes>(
				frameworkService,
				this.#modulesInstances,
				this.#response
			);
			const ports = new PortPorts(
				this.#services,
				this.#modulesInstances,
				this.#response
			);
			this.#layersService = new ServiceLayers<TFwReq, TFwRes>(
				controllers.getAll(this.#services),
				ports.getAll()
			);
			const routes = new PortRoutes(this.#modulesInstances);
			this.#domainList.push(...routes.getAll());
		} catch (error) {
			throw normalizeError(error);
		}
	}

	getDomainGroups(): IDomainGroup[] {
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

	#getDependencies(): IServicesDependencies {
		return {
			crypto: { client: clientCrypto },
			mail: { client: clientNodemailer },
			schema: { client: clientAjv },
		};
	}
}
