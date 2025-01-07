import {
	IDomainGroup,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
} from '@monomod/core/domain';
import { AdapterApi } from './infra';
import { normalizeError } from '@monomod/core/application';

export class ApiCore<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.#framework = frameworkService;
	}

	getDomains(): IDomainGroup[] {
		try {
			const apiAdapter = new AdapterApi<TFwReq, TFwRes>(
				this.#framework
			);
			return apiAdapter.getDomainGroups();
		} catch (error) {
			throw normalizeError(error);
		}
	}
}
