import { ServerController } from '../../src/infra/server.controller';
import { IServer, IServiceMessages, TOKENS } from '@monomod/core/domain';
import { IFrameworkAdapter } from '@monomod/core/domain';
import { IExpressApps } from '@monomod/framework-express/domain';

describe('ServerController', () => {
	let controller: ServerController;
	let mockServer: jest.Mocked<IServer>;
	let mockMessages: jest.Mocked<IServiceMessages>;
	let mockAdapter: jest.Mocked<IFrameworkAdapter>;

	beforeEach(() => {
		mockServer = {
			start: jest.fn(),
		} as unknown as jest.Mocked<IServer>;

		mockMessages = {
			getMessage: jest.fn(),
		} as unknown as jest.Mocked<IServiceMessages>;

		mockAdapter = {
			getApps: jest.fn(),
		} as unknown as jest.Mocked<IFrameworkAdapter>;

		controller = new ServerController(mockServer, mockMessages, mockAdapter);
	});

	it('should deploy servers successfully', async () => {
		const mockApps: IExpressApps = {
			app1: {
				app: {} as any,
				httpPort: 3000,
				name: 'example',
				cors: {
					dnsDomains: ['http://localhost'],
					localhostAllowed: true,
				},
			},
		};

		mockAdapter.getApps.mockReturnValue(mockApps);

		await controller.deploy();

		expect(mockAdapter.getApps).toHaveBeenCalled();
		expect(mockServer.start).toHaveBeenCalledWith(mockApps.app1);
	});

	it('should handle deployment errors', async () => {
		const error = new Error('Test error');
		mockAdapter.getApps.mockImplementation(() => {
			throw error;
		});

		console.error = jest.fn();

		await controller.deploy();

		expect(mockMessages.getMessage).toHaveBeenCalledWith('create', [error]);
		expect(console.error).toHaveBeenCalled();
	});
});
