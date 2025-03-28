import { RegistryServerLocal } from '../src/infra/local.server.registry';
import { SYMBOLS } from '@monomod/core/domain';
import { localServerConfig } from '../src/domain/local.server.config';
import {mockPortContainer } from '@monomod/core/mocks';

describe('RegistryServerLocal', () => {
	let registry: RegistryServerLocal;

	beforeEach(() => {
		jest.resetAllMocks();
		registry = new RegistryServerLocal();
	});

	describe('getName', () => {
		it('should return correct registry name', () => {
			expect(registry.getName()).toBe('RegistryServerLocal');
		});
	});

	describe('registerDependency', () => {
		it('should register all required components when none are registered', () => {
			mockPortContainer.hasRegistration.mockReturnValue(false);

			registry.registerDependency(mockPortContainer);

			expect(mockPortContainer.register).toHaveBeenCalledTimes(1);
			expect(mockPortContainer.register).toHaveBeenCalledWith({
				isConstant: true,
				token: SYMBOLS.server.IServerConfig,
				value: localServerConfig,
			});
		});

		it('should skip registration for already registered components', () => {
			mockPortContainer.hasRegistration.mockReturnValue(true);
			registry.registerDependency(mockPortContainer);
			expect(mockPortContainer.register).not.toHaveBeenCalled();
		});

		it('should register components with correct configuration', () => {
			mockPortContainer.hasRegistration.mockReturnValueOnce(false);
			registry.registerDependency(mockPortContainer);
			expect(mockPortContainer.register).toHaveBeenCalledTimes(1);
			const registeredComponents = mockPortContainer.register.mock.calls.map(
				(call) => call[0]
			);

			expect(registeredComponents).toEqual(
				expect.arrayContaining([
					{
						isConstant: true,
						token: SYMBOLS.server.IServerConfig,
						value: localServerConfig,
					},
				])
			);
		});

		it('should handle registration errors gracefully', () => {
			mockPortContainer.hasRegistration.mockReturnValue(false);
			mockPortContainer.register.mockImplementation(() => {
				throw new Error('Registration failed');
			});

			expect(() => registry.registerDependency(mockPortContainer)).toThrow(
				'Registration failed'
			);
		});
	});
});
