import { DIContainer, Injectable, Inject } from '@monomod/core/application';

describe('DIContainer', () => {
	let container: DIContainer;

	beforeEach(() => {
		container = DIContainer.getInstance();
	});

	describe('getInstance', () => {
		it('should always return the same instance', () => {
			const instance1 = DIContainer.getInstance();
			const instance2 = DIContainer.getInstance();
			expect(instance1).toBe(instance2);
		});
	});

	describe('register', () => {
		it('should register a component', () => {
			const token = Symbol('test');
			const component = { token, value: class TestService {} };

			container.register(component);
			expect(container.hasRegistration(token)).toBe(true);
		});

		it('should register a constant component', () => {
			const token = Symbol('config');
			const value = { apiUrl: 'http://test.com' };
			const component = { token, value, isConstant: true };

			container.register(component);
			const resolved = container.resolve(token);
			expect(resolved).toBe(value);
		});

		it('should throw error when registering duplicate non-constant component', () => {
			const token = Symbol('test');
			const component = { token, value: class TestService {} };

			container.register(component);
			expect(() => container.register(component)).toThrow();
		});

		it('should throw error when registering duplicate component w/ different value', () => {
			const token = Symbol('test');
			const component = { token, value: class TestService {} };
			container.register(component);
			const component2 = { token, value: class TestService2 {} };
			expect(() => container.register(component2)).toThrow();
		});
	});

	describe('resolve', () => {
		it('should resolve registered class with constructor injection', () => {
			// Setup
			const dependencyToken = Symbol('dependency');
			const serviceToken = Symbol('service');

			@Injectable(dependencyToken)
			class Dependency {
				getValue() {
					return 'dependency';
				}
			}

			@Injectable(serviceToken)
			class Service {
				constructor(@Inject(dependencyToken) private dependency: Dependency) {}
				getValue() {
					return this.dependency.getValue();
				}
			}

			// Act
			const service = container.resolve<Service>(serviceToken);

			// Assert
			expect(service).toBeInstanceOf(Service);
			expect(service.getValue()).toBe('dependency');
		});

		it('should resolve registered class with property injection', () => {
			// Setup
			const dependencyToken = Symbol('dependency');
			const serviceToken = Symbol('service');

			@Injectable(dependencyToken)
			class Dependency {
				getValue() {
					return 'dependency';
				}
			}

			@Injectable(serviceToken)
			class Service {
				@Inject(dependencyToken)
				private dependency: Dependency;

				getValue() {
					return this.dependency.getValue();
				}
			}

			// container.register({ token: dependencyToken, value: Dependency });
			// container.register({ token: serviceToken, value: Service });

			// Act
			const service = container.resolve<Service>(serviceToken);

			// Assert
			expect(service).toBeInstanceOf(Service);
			expect(service.getValue()).toBe('dependency');
		});

		it('should throw error when resolving unregistered token', () => {
			const token = Symbol('unregistered');
			expect(() => container.resolve(token)).toThrow();
		});

		it('should cache instances for subsequent resolves', () => {
			const token = Symbol('test');

			@Injectable(token)
			class TestService {
				value = Math.random();
			}

			// container.register({ token, value: TestService });

			const instance1 = container.resolve<TestService>(token);
			const instance2 = container.resolve<TestService>(token);

			expect(instance1).toBe(instance2);
			expect(instance1.value).toBe(instance2.value);
		});

		it('should throw error when implementation is not found for registered token', () => {
      // Arrange
      const token = Symbol('test');
      // Registramos un componente con implementación undefined
      container.register({ token, value: undefined });

      // Act & Assert
      expect(() => container.resolve(token))
        .toThrow('No provider found for Symbol(test)');
    });

		it('should return non-class implementation directly', () => {
      // Arrange
      const token = Symbol('config');
      const directValue = { api: 'http://test.com', key: 'value' };
      container.register({ token, value: directValue });

      // Act
      const resolved = container.resolve(token);

      // Assert
      expect(resolved).toBe(directValue);
    });
	});

	describe('hasRegistration', () => {
		it('should return true for registered tokens', () => {
			const token = Symbol('test');
			container.register({ token, value: class TestService {} });
			expect(container.hasRegistration(token)).toBe(true);
		});

		it('should return false for unregistered tokens', () => {
			const token = Symbol('unregistered');
			expect(container.hasRegistration(token)).toBe(false);
		});
	});
});
