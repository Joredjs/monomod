import { HTTPCODES, IDomainGroup } from '@monomod/core/domain';
import axios, { AxiosInstance } from 'axios';

export class EndpointTester {
	private client: AxiosInstance;

	constructor(private baseURL = 'http://localhost:3000') {
		this.client = axios.create({ baseURL });
	}

	testEndpoint(routes: IDomainGroup, path: string) {
		const pathConfig = routes.paths[path];

		if (!pathConfig) throw new Error(`Path ${path} not found in route group`);

		describe(`Testing ${routes.name} - ${path}`, () => {
			beforeAll(() => {
				// Setup any necessary test data or authentication
			});

			it(`should handle ${pathConfig.method} request`, async () => {
				try {
					// Generate test data based on schema
					const testData = this.generateTestData(pathConfig.schema);

					// Make the request
					const response = await this.client.request({
						data: testData,
						method: pathConfig.method,
						url: path,
						// Headers: routes.headers,
					});

					// Basic validations
					expect(response.status).toBe(HTTPCODES[200].code);
					expect(response.data).toBeDefined();

					// Schema validation if available
					if (pathConfig.schema.response) {
						// Add schema validation logic here
					}
				} catch (error) {
					// Handle expected errors based on schema
					if (error.response) {
						expect(error.response.status).toBeGreaterThanOrEqual(
							HTTPCODES[400].code
						);
						expect(error.response.status).toBeLessThan(HTTPCODES[500].code);
					} else {
						throw error;
					}
				}
			});

			// Add more specific test cases based on the endpoint
		});
	}

	private generateTestData(schema: any): any {
		/* Implement test data generation based on schema
		   This would create valid test data matching the schema */
		return {};
	}
}
