import { IExpressMicroApp } from '@nxms/framework-express/domain';
import { getLanguageTexts } from '@nxms/core/domain';

export class LocalServer {
	start(microApp: IExpressMicroApp) {
		// Start a server per each microapp
		if (microApp) {
			const { app, httpPort } = microApp;
			const server = app.listen(httpPort, () => {
				console.debug(
					getLanguageTexts('appsServerMsgListening', [microApp.name, httpPort])
				);
			});

			// Handle server errors
			server.on('error', (err) => {
				console.error(
					getLanguageTexts('appsServerErrStarting', [microApp.name]),
					err
				);
			});

			// Graceful shutdown
			process.on('SIGINT', () => {
				server.close(() => {
					console.debug(
						getLanguageTexts('appsServerErrStoping', [microApp.name])
					);
					process.exit(0);
				});
			});
		}
	}
}
