import { IExpressMicroApp } from '@nxms/framework-express/domain';
import { addListener } from 'node:process';

export class LocalServer {
	start(microApp: IExpressMicroApp) {
		// Start a server per each microapp
		if (microApp) {
			const { app, httpPort } = microApp;
			const server = app.listen(httpPort, () => {
				console.debug(
					`MicroApp '${microApp.name}' listening at http://localhost:${httpPort}`
				);
			});

			// Handle server errors
			server.on('error', (err) => {
				console.error(`Error starting microapp '${microApp.name}':`, err);
			});

			// Graceful shutdown
			process.on('SIGINT', () => {
				server.close(() => {
					console.debug(`MicroApp '${microApp.name}' stopped 1`);
					process.exit(0);
				});
			});
		}
	}
}
