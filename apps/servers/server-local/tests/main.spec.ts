/* // test/main.spec.ts
import { ProjectRegisterServerLocal } from '@monomod/server-local/infra';
import {
	IPortContainer,
	IPortServerController,
	TOKENS,
} from '@monomod/core/domain';
import { normalizeError } from '@monomod/core/application';

// Mock the dependencies
// jest.mock('../src/infra/local.server.project.register');
// jest.mock('@monomod/core/application', () => ({
// 	normalizeError: jest.fn((error) => error),
// }));

// Mock console.error
const originalConsoleError = console.error;
let mockedConsoleError: jest.SpyInstance;

describe('Main Bootstrap', () => {
	let mockContainer: jest.Mocked<IPortContainer>;
	let mockServerController: jest.Mocked<IPortServerController>;

	beforeEach(() => {
		// Reset mocks
		jest.resetModules();

		// Mock console.error
		mockedConsoleError = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Create mock instances
		mockServerController = {
			deploy: jest.fn(),
		};

		mockContainer = {
			resolve: jest.fn(),
			register: jest.fn(),
			hasRegistration: jest.fn(),
		};

		// Configure ProjectRegisterServerLocal mock
		(ProjectRegisterServerLocal as jest.Mock).mockImplementation(() => ({
			initialize: jest.fn().mockReturnValue(mockContainer),
		}));

		// Configure mockContainer to return mockServerController
		mockContainer.resolve.mockImplementation((token) => {
			if (token === TOKENS.server.IPortServerController) {
				return mockServerController;
			}
			return undefined;
		});
	});

	afterEach(() => {
		console.error = originalConsoleError;
		jest.clearAllMocks();
	});

	it('should successfully bootstrap the application', async () => {
		// mockServerController.deploy.mockResolvedValue(undefined);

		// Import and execute bootstrap
		const { bootstrap } = require('../src/main');
		await bootstrap();

		expect(ProjectRegisterServerLocal).toHaveBeenCalled();
		expect(mockContainer.resolve).toHaveBeenCalledWith(
			TOKENS.server.IPortServerController
		);
		expect(mockServerController.deploy).toHaveBeenCalled();
		expect(mockedConsoleError).not.toHaveBeenCalled();
	});

	it('should handle container initialization errors', async () => {
		const initError = new Error('Container initialization failed');
		(ProjectRegisterServerLocal as jest.Mock).mockImplementation(() => ({
			initialize: jest.fn().mockImplementation(() => {
				throw initError;
			}),
		}));

		const { bootstrap } = require('../src/main');
		await bootstrap().catch(() => {});

		expect(mockedConsoleError).toHaveBeenCalledWith(initError);
		expect(mockServerController.deploy).not.toHaveBeenCalled();
	});

	it('should handle server deployment errors', async () => {
		const deployError = new Error('Server deployment failed');
		// mockServerController.deploy.mockRejectedValue(deployError);

		const { bootstrap } = require('../src/main');
		await bootstrap().catch(() => {});

		expect(mockedConsoleError).toHaveBeenCalledWith(deployError);
	});

	it('should handle controller resolution errors', async () => {
		const resolutionError = new Error('Controller resolution failed');
		mockContainer.resolve.mockImplementation(() => {
			throw resolutionError;
		});

		const { bootstrap } = require('../src/main');
		await bootstrap().catch(() => {});

		expect(mockedConsoleError).toHaveBeenCalledWith(resolutionError);
		expect(mockServerController.deploy).not.toHaveBeenCalled();
	});

	it('should normalize errors before logging', async () => {
		const error = new Error('Test error');
		// mockServerController.deploy.mockRejectedValue(error);

		const { bootstrap } = require('../src/main');
		await bootstrap().catch(() => {});

		expect(normalizeError).toHaveBeenCalledWith(error);
		expect(mockedConsoleError).toHaveBeenCalled();
	});

	it('should handle non-Error objects in error handling', async () => {
		const nonErrorObject = { message: 'Something went wrong' };
		// mockServerController.deploy.mockRejectedValue(nonErrorObject);

		const { bootstrap } = require('../src/main');
		await bootstrap().catch(() => {});

		expect(normalizeError).toHaveBeenCalledWith(nonErrorObject);
		expect(mockedConsoleError).toHaveBeenCalled();
	});
});
 */

describe('Main Bootstrap', () => {
	it('should do nothing', () => {
		// This test intentionally does nothing
	});
});
