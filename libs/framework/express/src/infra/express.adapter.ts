import {
	IDomainGroup,
	IMicroApp,
	IPortFrameworkAdapter,
	IPortFrameworkDebug,
	IPortFrameworkFactory,
	SYMBOLS,
} from '@monomod/core/domain';
import { Inject, Injectable, normalizeError } from '@monomod/core/application';
import { TExpressReq, TExpressRes } from '../domain/express.interface';
import { ApiCore } from '@monomod/gateway';

@Injectable(SYMBOLS.framework.IFrameworkAdapter)
export class AdapterExpress implements IPortFrameworkAdapter {
	@Inject(SYMBOLS.framework.IFrameworkFactory)
	private appFactory: IPortFrameworkFactory;

	@Inject(SYMBOLS.framework.IFrameworkDebug)
	private debug: IPortFrameworkDebug;

	getApps(): IMicroApp {
		const apps: IMicroApp = {};

		try {
			const apiCore = new ApiCore<TExpressReq, TExpressRes>();

			const domains: IDomainGroup[] = apiCore.getDomains();

			domains.forEach((domainGroup) => {
				const appName = `${domainGroup.name}App`;
				apps[appName] = this.appFactory.createMicroApp(domainGroup);
			});

			this.debug.routes(apps);
		} catch (error) {
			throw normalizeError(error);
		}

		return apps;
	}
}
