import { AdapterApi } from './infra';
import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IRouteGroup,
} from '@nxms/core/domain';

export class ApiCore<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;
	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#framework = frameworkService;
	}

	getRutas(): IRouteGroup<TFwParams>[] {
		const apiAdapter = new AdapterApi<TFwParams, TFwReq, TFwRes>(
			this.#framework
		);
		return apiAdapter.getRoutes();
	}
}
