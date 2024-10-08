import {
	IDomainGroup,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
} from '@nxms/core/domain';
import { AdapterApi } from './infra';
import { normalizeError } from '@nxms/core/application';

export class ApiCore<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#framework = frameworkService;
	}

	getDomains(): IDomainGroup<TFwParams>[] {
		try {
			const apiAdapter = new AdapterApi<TFwParams, TFwReq, TFwRes>(
				this.#framework
			);
			return apiAdapter.getDomainGroups();
		} catch (error) {
			throw normalizeError(error);
		}
	}
}
