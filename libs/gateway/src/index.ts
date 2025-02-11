import {
	IDomainGroup,
	IPortFrameworkService,
	IPortLogs,
	IRequestParams,
	IResponseParams,
	SYMBOLS,
} from '@monomod/core/domain';
import { Inject, normalizeError } from '@monomod/core/application';
import { AdapterApi } from './infra';

export class ApiCore<TFwReq extends IRequestParams, TFwRes extends IResponseParams> {
	// #framework: IPortFrameworkService<TFwRes>;

	@Inject(SYMBOLS.framework.IFrameworkService)
	private framework: IPortFrameworkService<TFwRes>;

	/* Constructor(frameworkService: IPortFrameworkService<TFwRes>) {
	   	this.#framework = frameworkService;
	   } */

	getDomains(): IDomainGroup[] {
		try {
			const apiAdapter = new AdapterApi<TFwReq, TFwRes>(this.framework);
			return apiAdapter.getDomainGroups();
		} catch (error) {
			throw normalizeError(error);
		}
	}
}
