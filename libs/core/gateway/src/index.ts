import { AdapterControllers, AdapterRoutes } from './infra';
import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
} from '@nxms/core-main/domain';
import { AdapterPorts } from './application';

export class ApiCore<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#controllers: AdapterControllers<TFwReq, TFwRes>;
	#ports: AdapterPorts;
	#framework: IFrameworkService<TFwRes>;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#framework = frameworkService;
		this.#controllers = new AdapterControllers<TFwReq, TFwRes>(this.#framework);
		this.#ports = new AdapterPorts();
	}

	getRutas() {
		const routeAdapter = new AdapterRoutes<TFwParams, TFwReq, TFwRes>(
			this.#controllers.getAll(),
			this.#ports.getAll()
		);
		return routeAdapter.getAll();
	}
}
