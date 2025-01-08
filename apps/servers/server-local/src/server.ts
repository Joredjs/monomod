import { IServer, IServiceI18n } from '@monomod/core/domain';
import { Inject, Injectable, ServiceI18n } from '@monomod/core/application';
import { IExpressMicroApp } from '@monomod/framework-express/domain';

@Injectable()
export class ServerLocal implements IServer {
	constructor(@Inject(ServiceI18n) private i18n: IServiceI18n) {}

	start(microApp: IExpressMicroApp) {
		// Start a server per each microapp
		if (microApp) {
			const { app, httpPort } = microApp;
			const server = app.listen(httpPort, () => {
				console.debug(
					this.i18n.getText({
						group: 'server',
						key: 'listening',
						params: [microApp.name, httpPort],
						type: 'info',
					})
				);
			});

			// Handle server errors
			server.on('error', (err) => {
				/* Console.error(
				   	getLanguageTexts('appsServerErrStarting', [microApp.name]),
				   	err
				   ); */
				console.error(
					this.i18n.getText({
						group: 'server',
						key: 'starting',
						params: [microApp.name],
						type: 'error',
					}),
					err
				);
			});

			// Graceful shutdown
			process.on('SIGINT', () => {
				server.close(() => {
					console.debug(
						this.i18n.getText({
							group: 'server',
							key: 'stopping',
							params: [microApp.name],
							type: 'error',
						})
					);
					process.exit(0);
				});
			});
		}
	}
}
