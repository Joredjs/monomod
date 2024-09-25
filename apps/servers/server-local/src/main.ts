import { ExpressFramework } from '@nxms/framework-express';

// Create an instance of the ExpressFramework
const framework = new ExpressFramework({
	bodyLimit: '5mb',
	debug: { routes: true },
});

// Retrieve the configured microservices
const microServices = framework.getServices();

// Iterate through the microservices and start each server
Object.values(microServices).forEach((service) => {
	if (service) {
		const { port, app } = service;
		const server = app.listen(port, () => {
			console.debug(
				`Microservice '${service.name}' listening at http://localhost:${port}`
			);
		});

		// Handle server errors
		server.on('error', (err) => {
			console.error(`Error starting microservice '${service.name}':`, err);
		});
	}
});
