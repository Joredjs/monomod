import {
	IFrameworkAdapter,
	IServer,
	IServerController,
	IServiceMessages,
	TOKENS,
} from '@monomod/core/domain';
import { IExpressApps } from '@monomod/framework-express/domain';
import { Inject } from '@monomod/core/application';

export class ServerController implements IServerController {
	constructor(
		@Inject(TOKENS.server.IServer) private serverPort: IServer,
		@Inject(TOKENS.services.IServiceMessages) private messages: IServiceMessages,
		@Inject(TOKENS.framework.IExpressAdapter)
		private adapterExpress: IFrameworkAdapter
	) {}

	async deploy() {
		try {
			const framework = this.adapterExpress;
			const microApps: IExpressApps = framework.getApps();

			await Promise.all(
				Object.values(microApps).map(async (microApp) => {
					await this.serverPort.start(microApp);
				})
			);
		} catch (error) {
			console.error(this.messages.getMessage('create', [error]));
		}
	}
}
