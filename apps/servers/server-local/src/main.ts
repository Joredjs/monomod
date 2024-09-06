import { getServices } from '@nxms/framework-express';

const microServices = getServices({ addGroupName: true });
for (const service in microServices) {
	if (microServices[service]) {
		const myPort = microServices[service].port;
		const server = microServices[service].app.listen(myPort, () => {
			console.debug(`Listening ${service} at http://localhost:${myPort}`);
		});
		server.on('error', console.error);
	}
}
