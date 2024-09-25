import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IRouteGroup,
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
} from '@nxms/core/application';
import { clientCrypto, clientMailer, clientSchema } from './dependencies';

export class AdapterApi<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#routeList: IRouteGroup<TFwParams>[] = [];

	#modulesInstances: TMyModulesInstances = {};

	#services: IServices = {};

	#layersService;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#setModulesList();
		this.#setServices();

		const ports = new PortPorts(this.#services, this.#modulesInstances);
		const controllers = new PortControllers<TFwReq, TFwRes>(
			frameworkService,
			this.#modulesInstances
		);
		this.#layersService = new ServiceLayers<TFwReq, TFwRes>(
			controllers.getAll(this.#services),
			ports.getAll()
		);
		const routes = new PortRoutes<TFwParams>(this.#modulesInstances);
		this.#routeList = routes.getAll();
	}

	getRoutes(): IRouteGroup<TFwParams>[] {
		return this.#routeList.map((rgroup) => ({
			...rgroup,
			handler: this.#layersService.getController(rgroup.group).handler,
			port: this.#layersService.getPort(rgroup.group),
		}));
	}

	#setModulesList() {
		this.#modulesInstances.example = {
			Controller: ModuleExampleController,
			Port: ModuleExamplePort,
			Route: ModuleExampleRoutes,
		};
	}

	#setServices() {
		const dependencies: IServicesDependencies = this.#setDependencies();

		this.#services.crypto = new ServiceCrypto(dependencies.crypto.client);
		this.#services.encode = new ServiceEncode();
		this.#services.headers = new ServiceHeaders(this.#services.crypto);
		this.#services.mail = new ServiceMail(dependencies.mail.client);
		this.#services.useCases = new ServiceUseCases();
		this.#services.schema = new ServiceSchema(dependencies.schema.client);
	}

	#setDependencies() {
		return {
			crypto: { client: clientCrypto },
			mail: { client: clientMailer },
			schema: { client: clientSchema },
		};
	}
}
