import { IServer, IServiceMessages, TOKENS } from '@monomod/core/domain';
import { IExpressMicroApp } from '@monomod/framework-express/domain';
import { Inject } from '@monomod/core/application';

export class ServerPort implements IServer {
	constructor(
		@Inject(TOKENS.services.IServiceMessages) private messages: IServiceMessages
	) {}

	start(microApp: IExpressMicroApp) {
		// Start a server per each microapp
		if (microApp) {
			const { app, httpPort } = microApp;
			const server = app.listen(httpPort, () => {
				console.debug(
					this.messages.getMessage('listen', [microApp.name, httpPort])
				);
			});

			// Handle server errors
			server.on('error', (err) => {
				console.error(this.messages.getMessage('start', [err]));
			});

			// Graceful shutdown
			process.on('SIGINT', () => {
				server.close(() => {
					console.debug(this.messages.getMessage('stop', [microApp.name]));
					process.exit(0);
				});
			});
		}
	}
}
