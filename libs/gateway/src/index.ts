import {
	AdapterRoutes,
	clientCrypto,
	clientMailer,
	clientSchema,
} from './infra';
import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IRouteGroup,
	IServicesDependencies,
} from '@nxms/core/domain';

export class ApiCore<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;

	#dependencies: IServicesDependencies;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#dependencies = {
			crypto: { client: clientCrypto },
			mail: { client: clientMailer },
			schema: { client: clientSchema },
		};
		this.#framework = frameworkService;
	}

	getRutas(): IRouteGroup<TFwParams>[] {
		const routeAdapter = new AdapterRoutes<TFwParams, TFwReq, TFwRes>(
			this.#framework,
			this.#dependencies
		);
		return routeAdapter.getAll();
	}
}
