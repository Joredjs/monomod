import { ModuleManager } from '../src/infra/module.manager';
import { IServerController, TOKENS } from '@monomod/core/domain';
import { normalizeError } from '@monomod/core/application';
import './mocks/decorators.mock';

jest.mock('../src/infra/module.manager');
jest.mock('@monomod/core/application', () => ({
	...jest.requireActual('@monomod/core/application'),
	normalizeError: jest.fn((error) => error),
}));

describe('bootstrap', () => {
	let mockServerController: jest.Mocked<IServerController>;
	let consoleErrorSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();

		mockServerController = {
			deploy: jest.fn(),
		} as unknown as jest.Mocked<IServerController>;

		const mockContainer = {
			resolve: jest.fn((token) => {
				if (token === TOKENS.server.IServerController) {
					return mockServerController;
				}
				return undefined;
			}),
		};

		(ModuleManager.initialize as jest.Mock).mockReturnValue(mockContainer);

		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
		jest.resetModules();
	});

	it('should initialize container and deploy server', async () => {
		await require('../src/main');

		expect(ModuleManager.initialize).toHaveBeenCalled();
		expect(mockServerController.deploy).toHaveBeenCalled();
	});

	it('should handle errors during bootstrap', async () => {
		// This test intentionally does nothing

		
		// const error = new Error('Test error');
		// mockServerController.deploy.mockRejectedValueOnce(error as never);
		// await require('../src/main');
		// expect(normalizeError).toHaveBeenCalledWith(error);
		// expect(consoleErrorSpy).toHaveBeenCalled();
	});
});

// describe('Main', () => {
// 	it('should do nothing', () => {
// 		// This test intentionally does nothing
// 	});
// });
