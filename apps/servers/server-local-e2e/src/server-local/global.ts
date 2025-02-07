// Apps/server-local-e2e/src/support/test-helpers.ts
import {
	EHttpMethods,
	IDomainGroup,
	IFrameworkMicroApp,
	IPortFrameworkAdapter,
	IRoute,
	TOKENS,
} from '@monomod/core/domain';
import { ApiCore } from '@monomod/gateway';
import { Inject } from '@monomod/core/application';

interface EndpointInfo {
	method: EHttpMethods;
	path: string;
	microApp: IFrameworkMicroApp;
	route: IRoute;
	headers?: string[];
}

export class TestHelper {
	private static endpoints: Map<string, EndpointInfo> = new Map();

	@Inject(TOKENS.framework.IFrameworkAdapter)
	private readonly frameworkAdapter: IPortFrameworkAdapter;

	async loadEndpoints() {
		const apps = await this.frameworkAdapter.getApps();
	}

	static getEndpoint(name: string): EndpointInfo | undefined {
		return this.endpoints.get(name);
	}

	static getAllEndpoints(): Map<string, EndpointInfo> {
		return this.endpoints;
	}

	static getEndpointsByMicroApp(microAppName: string): EndpointInfo[] {
		return Array.from(this.endpoints.values()).filter(
			(endpoint) => endpoint.microApp.name === microAppName
		);
	}

	static getBaseHeaders() {
		return {
			'x-monomod-so': 'web',
		};
	}

	static getEndpointUrl(endpointInfo: EndpointInfo): string {
		return `http://localhost:${endpointInfo.microApp.httpPort}/${endpointInfo.microApp.name}/${endpointInfo.path}`;
	}
}
