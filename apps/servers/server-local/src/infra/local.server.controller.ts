import {
	IFrameworkMicroApp,
	IPortFrameworkAdapter,
	IPortLogs,
	IPortMessages,
	IPortServerAdapter,
	IPortServerController,
	TOKENS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

// TODO: validate if is injectable o registered
@Injectable(TOKENS.server.IPortServerController)
export class ControllerServerLocal implements IPortServerController {
	@Inject(TOKENS.services.logs)
	readonly logs: IPortLogs;

	@Inject(TOKENS.framework.IFrameworkAdapter)
	private readonly frameworkAdapter: IPortFrameworkAdapter;

	@Inject(TOKENS.server.IPortServerAdapter)
	readonly serverAdapter: IPortServerAdapter;

	@Inject(TOKENS.server.ServerMessagesService)
	readonly messages: IPortMessages;

	async deploy() {
		try {
			await this.#startApps(this.frameworkAdapter.getApps());
		} catch (error) {
			this.logs.error(
				this.messages.getMessage('create', [JSON.stringify(error)])
			);
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
