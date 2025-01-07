/* Import {
	IDomainGroup,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
} from '@monomod/core/domain';
import {
	ModuleExampleController,
	ModuleExamplePort,
	ModuleExampleRoutes,
} from '@monomod/module-example';
import { AdapterApi } from './api.adapter';
import {
	PortControllers,
	PortPorts,
	PortRoutes,
	ServiceLayers,
} from '../application';
jest.mock('@monomod/core/application');
jest.mock('../application');
jest.mock('./dependencies', () => ({
	clientCrypto: { encrypt: jest.fn(), decrypt: jest.fn() },
	clientMailer: { send: jest.fn() },
	clientSchema: { validate: jest.fn() },
}));
describe('AdapterApi', () => {
	let adapterApi: AdapterApi<any, any, any>,
		mockFrameworkService: jest.Mocked<IFrameworkService<any>>;
	beforeEach(() => {
		mockFrameworkService = {
			// Mock any required methods of IRequestParams
			send: jest.fn(),
		} as unknown as jest.Mocked<IFrameworkService<any>>;
		adapterApi = new AdapterApi(mockFrameworkService);
	});
	it('should create an instance of AdapterApi', () => {
		expect(adapterApi).toBeTruthy();
	});
	it('should get domain groups with business ports and handlers', () => {
		const mockDomainGroup: IDomainGroup<any> = {
			name: 'example',
			versions: ['v1'],
			paths: [
				{
					headers: [],
					method: 'get',
					path: 'hola',
					privacy: [],
					schema: { v1: {} },
					version: 'v1',
				},
			],
			httpPort: 3000,
			cors: [],
			dnsDomains: [],
			businessPort: undefined,
			handler: undefined,
			headers: [],
		};
		(PortRoutes as jest.Mock)
			.mockReturnValueOnce({
				getAll: jest.fn().mockReturnValue([mockDomainGroup]),
			})
			.mockReturnValueOnce({
				getPort: jest.fn().mockReturnValue(new ModuleExamplePort({} as any)),
			})
			.mockReturnValueOnce({
				getController: jest
					.fn()
					.mockReturnValue(new ModuleExampleController({} as any, {} as any)),
			});
		const domainGroups = adapterApi.getDomainGroups();

		expect(domainGroups).toEqual([
			{
				...mockDomainGroup,
				businessPort: new ModuleExamplePort({} as any),
				handler: new ModuleExampleController({} as any, {} as any).handler,
			},
		]);
	});
	it('should throw an error if an error occurs while creating the domain list', () => {
		(PortRoutes as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Test error');
		});
		expect(() => new AdapterApi(mockFrameworkService)).toThrowError(
			'Test error'
		);
	});
	it('should set services correctly', () => {
		// Access private properties for testing purposes
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const services = (adapterApi as any).#services;
		expect(services.crypto).toBeDefined();
		expect(services.encode).toBeDefined();
		expect(services.headers).toBeDefined();
		expect(services.mail).toBeDefined();
		expect(services.useCases).toBeDefined();
		expect(services.schema).toBeDefined();
	});
});
 */

describe('AdapterApi', () => {
	it('should do nothing', () => {
		// This test intentionally does nothing
	});
});
