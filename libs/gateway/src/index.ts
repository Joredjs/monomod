import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IRouteGroup,
	setError,
} from '@nxms/core/domain';
import { AdapterApi } from './infra';

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
		try {
			const apiAdapter = new AdapterApi<TFwParams, TFwReq, TFwRes>(
				this.#framework
			);
			return apiAdapter.getRoutes();
		} catch (error) {
			throw setError(error);
		}
	}
}
