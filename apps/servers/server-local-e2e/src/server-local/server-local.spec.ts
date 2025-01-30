// Import { ApiCore } from '@monomod/gateway';
import { EndpointTester } from './endpoint.tester';
// Import { TOKENS } from '@monomod/core/domain';

describe('API E2E Tests', () => {
	const tester = new EndpointTester();
	const gateway = {
		getModules: () => [],
	};

	beforeAll(async () => {
		/* Start your server
		   Initialize gateway */
	});

	it('should test all endpoints', async () => {
		// const modules = gateway.getModules();
		// const promises = [];
		// for (const module of modules) {
		// 	if (module) {
		// 		const routes = module.getRoutes();
		// 		for (const path in routes.paths) {
		// 			if (path) {
		// 				promises.push(tester.testEndpoint(routes, path));
		// 			}
		// 		}
		// 	}
		// }
		// await Promise.all(promises);
	});
});
