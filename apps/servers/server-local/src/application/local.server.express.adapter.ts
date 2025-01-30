import {
	IFrameworkMicroApp,
	IPortErrors,
	IPortLogs,
	IPortMessages,
	IPortServerAdapter,
	TOKENS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

@Injectable(TOKENS.server.IPortServerAdapter)
export class AdapterServerLocalExpress implements IPortServerAdapter {
	@Inject(TOKENS.server.ServerMessagesService)
	private messages: IPortMessages;

	@Inject(TOKENS.services.logs) private logs: IPortLogs;

	@Inject(TOKENS.services.errors) private errors: IPortErrors;

	#validateMicroApp(microApp: IFrameworkMicroApp): void {
		if (!microApp) {
			// Throw this.messages.getMessage('configuration');
			this.errors.handle({
				detail: microApp,
				errType: 'badConfigured',
				text: this.messages.getMessage('configuration'),
			});
		}
	}

	#startServer(microApp: IFrameworkMicroApp): Promise<any> {
		const { app, httpPort, name } = microApp;
		return new Promise((resolve) => {
			const server = app.listen(httpPort, () => {
				this.logs.debug(this.messages.getMessage('listen', [name, httpPort]));
				resolve(server);
			});
		});
	}

	async start(microApp: IFrameworkMicroApp): Promise<void> {
		this.#validateMicroApp(microApp);

		/* Starts a server per each microapp
		   const { app, httpPort, name } = microApp;
		   const server = app.listen(httpPort, () => {
		   	this.logs.debug(this.messages.getMessage('listen', [name, httpPort]));
		   }); */
		const server = await this.#startServer(microApp);

		this.errorHandler(server, microApp.name);
		this.gracefulShutdown(server, microApp.name);
	}

	errorHandler(server: any, name: string): void {
		server.on('error', (err) => {
			this.logs.error(this.messages.getMessage('start', [name, err]));
		});
	}

	gracefulShutdown(server: any, name: string): void {
		const shutdown = async () => {
			try {
				await new Promise((resolve) => server.close(resolve));
				this.logs.debug(this.messages.getMessage('stop', [name]));
				process.exit(0);
			} catch (error) {
				this.logs.error(this.messages.getMessage('stop', [name, error]));
				process.exit(1);
			}
		};

		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);
	}
}
