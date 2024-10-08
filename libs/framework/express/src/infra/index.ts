import { ExpressDebug, ExpressFactory, ExpressService } from '../application';
import { IDomainGroup, IMicroAppConfig } from '@nxms/core/domain';
import {
	IExpressApps,
	IExpressDebug,
	IExpressParams,
	IExpressService,
	TExpressReq,
	TExpressRes,
} from '../domain/interface';
import { ApiCore } from '@nxms/gateway';
import { normalizeError } from '@nxms/core/application';

export class ExpressFramework {
	#appConfig: IMicroAppConfig;

	#service: IExpressService;

	#debug: IExpressDebug;

	#appFactory: ExpressFactory;

	constructor(appConfig: IMicroAppConfig) {
		this.#appConfig = appConfig;
		this.#service = new ExpressService();
		this.#debug = new ExpressDebug();
		this.#appFactory = new ExpressFactory(
			appConfig,
			this.#debug,
			this.#service
		);
	}

	getApps(): IExpressApps {
		const apps: IExpressApps = {};

		try {
			const apiCore = new ApiCore<IExpressParams, TExpressReq, TExpressRes>(
				this.#service
			);

			const domains: IDomainGroup<IExpressParams>[] = apiCore.getDomains();

			domains.forEach((domainGroup) => {
				const appName = `${domainGroup.name}App`;
				apps[appName] = this.#appFactory.createMicroApp(domainGroup);
			});

			if (this.#appConfig.debug.routes) {
				this.#debug.routes(apps);
			}
		} catch (error) {
			throw normalizeError(error);
		}

		return apps;
	}
}
