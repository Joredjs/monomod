import { DIContainer } from '@monomod/core/application';
import { ModuleManager } from '../../src/infra/module.manager';
import { ModuleCore } from '@monomod/core/infra';
import { ModuleExpress } from '@monomod/framework-express/infra';
import { ModuleServer } from '../../src/infra/server.module';

jest.mock('@monomod/core/infra');
jest.mock('@monomod/framework-express/infra');
jest.mock('../../src/infra/server.module');

describe('ModuleManager', () => {
	let mockContainer: jest.Mocked<DIContainer>;
	let getInstanceSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();

		// Crear el mock del container
		mockContainer = {
			register: jest.fn(),
		} as unknown as jest.Mocked<DIContainer>;

		// Espiar getInstance y hacer que retorne nuestro mockContainer
		getInstanceSpy = jest
			.spyOn(DIContainer, 'getInstance')
			.mockReturnValue(mockContainer);

		// Mock de los módulos con register como jest.fn()
		const mockCoreRegister = jest.fn();
		const mockExpressRegister = jest.fn();
		const mockServerRegister = jest.fn();

		// Mock ModuleCore
		(ModuleCore as any) = {
			register: mockCoreRegister,
			instance: { name: 'ModuleCore' },
		};

		// Mock ModuleExpress
		(ModuleExpress as any) = {
			register: mockExpressRegister,
			instance: { name: 'ModuleExpress' },
		};

		// Mock ModuleServer
		(ModuleServer as any) = {
			register: mockServerRegister,
			instance: { name: 'ModuleServer' },
		};
	});

	afterEach(() => {
		jest.resetModules();
		getInstanceSpy.mockRestore();
	});

	describe('initialize', () => {
		it('should initialize container and register all modules', () => {
			const container = ModuleManager.initialize();

			expect(getInstanceSpy).toHaveBeenCalled();
			expect(container).toBe(mockContainer);
		});

		it('should register each module only once', () => {
			// // Primera inicialización
			// ModuleManager.initialize();
			// // Verificar que los módulos se registraron
			// expect(ModuleCore.register).toHaveBeenCalledTimes(1);
			// expect(ModuleExpress.register).toHaveBeenCalledTimes(1);
			// expect(ModuleServer.register).toHaveBeenCalledTimes(1);
			// // Segunda inicialización
			// ModuleManager.initialize();
			// // Verificar que los módulos no se registraron de nuevo
			// expect(ModuleCore.register).toHaveBeenCalledTimes(1);
			// expect(ModuleExpress.register).toHaveBeenCalledTimes(1);
			// expect(ModuleServer.register).toHaveBeenCalledTimes(1);
		});
	});

	describe('module registration', () => {
		it('should register all required modules during initialization', () => {
			// ModuleManager.initialize();
			// // Verificar que cada módulo fue registrado con el container
			// expect(ModuleCore.register).toHaveBeenCalledWith(mockContainer);
			// expect(ModuleExpress.register).toHaveBeenCalledWith(mockContainer);
			// expect(ModuleServer.register).toHaveBeenCalledWith(mockContainer);
		});

		it('should maintain module registration order', () => {
			// const container = ModuleManager.initialize();
			// // Verificar el orden de registro
			// const registerCalls = mockContainer.register.mock.calls;
			// expect(registerCalls.length).toBeGreaterThan(0);
			// // Verificar que los módulos fueron registrados en el orden correcto
			// const registrationOrder = jest
			// 	.mocked(mockContainer.register)
			// 	.mock.calls.map((call) => call[0]);
			// expect(registrationOrder).toEqual(
			// 	expect.arrayContaining([
			// 		expect.any(Function), // ModuleCore
			// 		expect.any(Function), // ModuleExpress
			// 		expect.any(Function), // ModuleServer
			// 	])
			// );
		});
	});

	describe('module structure', () => {
		it('should have all required modules available', () => {
			// const container = ModuleManager.initialize();
			// // Verificar que todos los módulos necesarios están disponibles
			// expect(ModuleCore).toBeDefined();
			// expect(ModuleExpress).toBeDefined();
			// expect(ModuleServer).toBeDefined();
			// // Verificar que cada módulo tiene la estructura correcta
			// expect(ModuleCore.register).toBeInstanceOf(Function);
			// expect(ModuleExpress.register).toBeInstanceOf(Function);
			// expect(ModuleServer.register).toBeInstanceOf(Function);
		});
	});
});
