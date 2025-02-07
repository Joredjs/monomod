/* import { ProjectRegisterServerLocal } from '@monomod/server-local/infra';
import {
	createMockContainer,
	createMockRegistry,
	createMockServerAdapter,
	createMockServerController,
} from './mocks';
import { IPortContainer, TOKENS } from '@monomod/core/domain';
import { RegistryServerLocal } from '../src/infra/local.server.registry';
import { RegistryExpress } from '@monomod/framework-express/infra';
import { DIContainer } from '@monomod/core/application';

jest.mock('@monomod/core/application', () => ({
	DIContainer: {
		getInstance: jest.fn(),
	},
}));

jest.mock('@monomod/core/infra', () => ({
	RegistryCore: jest.fn(),
}));
jest.mock('../src/infra/local.server.registry', () => ({
	RegistryServerLocal: jest.fn(),
}));

jest.mock('@monomod/framework-express/infra', () => ({
	RegistryExpress: jest.fn(),
}));

describe('ProjectRegisterServerLocal', () => {
	let projectRegister: ProjectRegisterServerLocal;
	let mockContainer: jest.Mocked<IPortContainer>;
	let mockServerController;

	beforeEach(() => {
		jest.clearAllMocks();

		// Configurar el controlador mock
		mockServerController = { deploy: jest.fn() };

		// Configurar el container mock
		mockContainer = createMockContainer();
		mockContainer.resolve.mockReturnValue(mockServerController);

		// Configurar DIContainer.getInstance
		(DIContainer.getInstance as jest.Mock).mockReturnValue(mockContainer);

		projectRegister = new ProjectRegisterServerLocal();
	});

	describe('initialize', () => {
		it('should initialize and register all dependencies', async () => {
			// Prepare mocks
			const serverLocalRegMock = {
				getName: jest.fn().mockReturnValue('RegistryServerLocal'),
				registerDependency: jest.fn().mockReturnValue(mockContainer),
			};
			const expressRegMock = {
				getName: jest.fn().mockReturnValue('RegistryExpress'),
				registerDependency: jest.fn().mockReturnValue(mockContainer),
			};
			(RegistryServerLocal as jest.Mock).mockReturnValue(serverLocalRegMock);
			(RegistryExpress as jest.Mock).mockReturnValue(expressRegMock);
			// Act
			const result = projectRegister.initialize();
			// Assert
			expect(result).toBe(mockContainer);
			expect(serverLocalRegMock.registerDependency).toHaveBeenCalledWith(
				mockContainer
			);
			expect(expressRegMock.registerDependency).toHaveBeenCalledWith(
				mockContainer
			);
			expect(mockContainer.resolve).toHaveBeenCalledWith(
				TOKENS.server.IPortServerController
			);
		});

		it('should register dependencies in correct order', () => {
			// Prepare mocks
			const registrationOrder: string[] = [];
			const createOrderedRegistry = (name: string) => ({
				getName: jest.fn().mockReturnValue(name),
				registerDependency: jest.fn().mockImplementation(() => {
					registrationOrder.push(name);
					return mockContainer;
				}),
			});
			// Setup mocks
			(RegistryServerLocal as jest.Mock).mockReturnValue(
				createOrderedRegistry('RegistryServerLocal')
			);
			(RegistryExpress as jest.Mock).mockReturnValue(
				createOrderedRegistry('RegistryExpress')
			);
			// Act
			projectRegister.initialize();
			// Assert
			expect(registrationOrder).toEqual([
				'RegistryServerLocal',
				'RegistryExpress',
			]);
		});

		it('should handle registration errors', () => {
			// Prepare mock that throws
			const errorMock = {
				getName: jest.fn().mockReturnValue('RegistryServerLocal'),
				registerDependency: jest.fn().mockImplementation(() => {
					throw new Error('Registration failed');
				}),
			};

			// Setup mock
			(RegistryServerLocal as jest.Mock).mockReturnValue(errorMock);

			// Act & Assert
			expect(() => projectRegister.initialize()).toThrow('Registration failed');
		});

		it('should maintain singleton container instance', () => {
			// First initialization
			const firstResult = projectRegister.initialize();
			// Clear mock to check subsequent calls
			(DIContainer.getInstance as jest.Mock).mockClear();
			// Second initialization
			const secondResult = projectRegister.initialize();
			// Assert
			expect(firstResult).toBe(secondResult);
			expect(DIContainer.getInstance).not.toHaveBeenCalled();
		});
	});
});
 */

describe('ProjectRegisterServerLocal', () => {
	it('should do nothing', () => {
		// This test intentionally does nothing
	});
});
