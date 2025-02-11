import {
	IFrameworkMicroApp,
	IPortFrameworkAdapter,
	IPortLogs,
	IPortServerAdapter,
	IPortServerController,
	SYMBOLS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

@Injectable(SYMBOLS.server.IPortServerController)
export class ControllerServerLocal implements IPortServerController {
	constructor(
		@Inject(SYMBOLS.server.ServiceLogsServer)
		private readonly logs: IPortLogs,
		@Inject(SYMBOLS.framework.IFrameworkAdapter)
		private readonly frameworkAdapter: IPortFrameworkAdapter,
		@Inject(SYMBOLS.server.IPortServerAdapter)
		private readonly serverAdapter: IPortServerAdapter
	) {}

	async deploy() {
		try {
			await this.#startApps(this.frameworkAdapter.getApps());
		} catch (error) {
			this.logs.error({
				messageKey: 'create',
				messageParams: [JSON.stringify(error)],
			});
		}
	}

	async #startApps(microApps: IFrameworkMicroApp) {
		await Promise.all(
			Object.values(microApps).map(async (microApp) => {
				await this.serverAdapter.start(microApp);
			})
		);
	}
}
