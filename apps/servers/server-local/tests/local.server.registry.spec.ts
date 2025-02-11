// test/registry-server-local.spec.ts
import { RegistryServerLocal } from '../src/infra/local.server.registry';
import { createMockContainer } from './mocks/shared.mock';
import { SYMBOLS } from '@monomod/core/domain';
import { ControllerServerLocal } from '@monomod/server-local/infra';
import { AdapterServerLocal } from '@monomod/server-local/application';
import { localServerConfig } from '../src/domain/local.server.config';
import { ServiceLogsServer } from '../src/application/local.server.logs.service';

describe('RegistryServerLocal', () => {
	let registry: RegistryServerLocal;
	let mockContainer: ReturnType<typeof createMockContainer>;

	beforeEach(() => {
		mockContainer = createMockContainer();
		registry = new RegistryServerLocal();
	});

	describe('getName', () => {
		it('should return correct registry name', () => {
			expect(registry.getName()).toBe('RegistryServerLocal');
		});
	});

	describe('registerDependency', () => {
		it('should register all required components when none are registered', () => {
			mockContainer.hasRegistration.mockReturnValue(false);

			registry.registerDependency(mockContainer);

			expect(mockContainer.register).toHaveBeenCalledTimes(4);
			expect(mockContainer.register).toHaveBeenCalledWith({
				token: SYMBOLS.server.IPortServerAdapter,
				value: AdapterServerLocal,
			});
			expect(mockContainer.register).toHaveBeenCalledWith({
				token: SYMBOLS.server.IPortServerController,
				value: ControllerServerLocal,
			});
			expect(mockContainer.register).toHaveBeenCalledWith({
				token: SYMBOLS.server.ServiceLogsServer,
				value: ServiceLogsServer,
			});
			expect(mockContainer.register).toHaveBeenCalledWith({
				isConstant: true,
				token: SYMBOLS.server.config,
				value: localServerConfig,
			});
		});

		it('should skip registration for already registered components', () => {
			mockContainer.hasRegistration.mockReturnValue(true);

			registry.registerDependency(mockContainer);

			expect(mockContainer.register).not.toHaveBeenCalled();
		});

		it('should register components with correct configuration', () => {
			mockContainer.hasRegistration
				.mockReturnValueOnce(false) // IPortServerAdapter
				.mockReturnValueOnce(true) // IPortServerController
				.mockReturnValueOnce(false); // config

			registry.registerDependency(mockContainer);

			expect(mockContainer.register).toHaveBeenCalledTimes(3);
			const registeredComponents = mockContainer.register.mock.calls.map(
				(call) => call[0]
			);

			expect(registeredComponents).toEqual(
				expect.arrayContaining([
					{
						token: SYMBOLS.server.IPortServerAdapter,
						value: AdapterServerLocal,
					},
					{
						isConstant: true,
						token: SYMBOLS.server.config,
						value: localServerConfig,
					},
				])
			);
		});

		it('should handle registration errors gracefully', () => {
			mockContainer.hasRegistration.mockReturnValue(false);
			mockContainer.register.mockImplementation(() => {
				throw new Error('Registration failed');
			});

			expect(() => registry.registerDependency(mockContainer)).toThrow(
				'Registration failed'
			);
		});
	});
});
