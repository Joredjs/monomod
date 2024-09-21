import { ExpressFramework } from '@nxms/framework-express';

const framework = new ExpressFramework({
	debug: { routes: true },
});

const microServices = framework.getServices();
for (const service in microServices) {
	if (microServices[service]) {
		const myPort = microServices[service].port;
		const server = microServices[service].app.listen(myPort, () => {
			console.debug(`Listening ${service} at http://localhost:${myPort}`);
		});
		server.on('error', console.error);
	}
}
