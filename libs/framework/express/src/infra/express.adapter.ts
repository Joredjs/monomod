import { ExpressDebug, ExpressFactory, ExpressService } from '../application';
import { IDomainGroup, IMicroAppConfig } from '@monomod/core/domain';
import {
	IExpressApps,
	IExpressDebug,
	IExpressFactory,
	IExpressService,
	TExpressReq,
	TExpressRes,
} from '../domain/interface';
import { ApiCore } from '@monomod/gateway';
import { normalizeError } from '@monomod/core/application';

export class AdapterExpress {
	#appConfig: IMicroAppConfig;

	#service: IExpressService;

	#debug: IExpressDebug;

	#appFactory: IExpressFactory;

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
			const apiCore = new ApiCore<TExpressReq, TExpressRes>(this.#service);

			const domains: IDomainGroup[] = apiCore.getDomains();

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
