import { IDomainGroup, IFrameworkAdapter, TOKENS } from '@monomod/core/domain';
import {
	IExpressApps,
	IExpressFactory,
	TExpressReq,
	TExpressRes,
} from '../domain/interface';
import { Inject, normalizeError } from '@monomod/core/application';
import { ApiCore } from '@monomod/gateway';

export class AdapterExpress implements IFrameworkAdapter {
	constructor(
		@Inject(TOKENS.framework.IExpressFactory)
		private appFactory: IExpressFactory
	) {}

	getApps(): IExpressApps {
		const apps: IExpressApps = {};

		try {
			const apiCore = new ApiCore<TExpressReq, TExpressRes>(
				this.appFactory.getService()
			);

			const domains: IDomainGroup[] = apiCore.getDomains();

			domains.forEach((domainGroup) => {
				const appName = `${domainGroup.name}App`;
				apps[appName] = this.appFactory.createMicroApp(domainGroup);
			});

			if (this.appFactory.getConfig().debug.routes) {
				this.appFactory.getDebug().routes(apps);
			}
		} catch (error) {
			throw normalizeError(error);
		}

		return apps;
	}
}
