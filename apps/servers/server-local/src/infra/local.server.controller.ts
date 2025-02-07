import {
	IFrameworkMicroApp,
	IPortFrameworkAdapter,
	IPortLogs,
	IPortServerAdapter,
	IPortServerController,
	TOKENS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

@Injectable(TOKENS.server.IPortServerController)
export class ControllerServerLocal implements IPortServerController {
	constructor(
		@Inject(TOKENS.server.ServiceLogsServer)
		private readonly logs: IPortLogs,
		@Inject(TOKENS.framework.IFrameworkAdapter)
		private readonly frameworkAdapter: IPortFrameworkAdapter,
		@Inject(TOKENS.server.IPortServerAdapter)
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
