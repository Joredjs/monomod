import { ExpressFramework } from '@nxms/framework-express/infra';

try {
	// Create an instance of the ExpressFramework

	const framework = new ExpressFramework({
		addDomainName: true,
		bodyLimit: '5mb',
		debug: { cors: true, paths: true, routes: true },
	});

	// Retrieve the configured microapps
	const microApps = framework.getApps();

	// Iterate through the microapps and start each server
	Object.values(microApps).forEach((microApp) => {
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
		}
	});
} catch (error) {
	console.error(`Error creating the microapps:`, error);
}
