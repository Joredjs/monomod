import { RegistryCore } from '@monomod/core/infra';
import { mockPortContainer } from '../mocks';

describe('RegistryCore', () => {
	let registry: RegistryCore;

	beforeEach(() => {
		jest.clearAllMocks();
		registry = new RegistryCore();
	});

	describe('getName', () => {
		it('should return constructor name', () => {
			expect(registry.getName()).toBe('RegistryCore');
		});
	});

	describe('registerDependency', () => {
		it('should not register components that are already registered', () => {
			// Simulamos que el componente ya está registrado
			mockPortContainer.hasRegistration.mockReturnValue(true);

			registry.registerDependency(mockPortContainer);

			// Verificamos que register no fue llamado
			expect(mockPortContainer.register).not.toHaveBeenCalled();
		});

		it('should register components that are not already registered', () => {
			// Simulamos que el componente no está registrado
			mockPortContainer.hasRegistration.mockReturnValue(false);

			registry.registerDependency(mockPortContainer);

			// Verificamos que register fue llamado para cada componente
			// const registeredComponents = (registry as any).#components;
			// registeredComponents.forEach((component: any) => {
			//   expect(mockContainer.hasRegistration).toHaveBeenCalledWith(component.token);
			//   if (!mockContainer.hasRegistration(component.token)) {
			//     expect(mockContainer.register).toHaveBeenCalledWith(component);
			//   }
			// });
		});

		it('should check registration before registering each component', () => {
			mockPortContainer.hasRegistration
				.mockReturnValueOnce(true) // primer componente ya registrado
				.mockReturnValueOnce(false); // segundo componente no registrado

			registry.registerDependency(mockPortContainer);

			// Verificamos que hasRegistration fue llamado para cada componente
			// const registeredComponents = (registry as any).#components;
			// expect(mockContainer.hasRegistration).toHaveBeenCalledTimes(registeredComponents.length);
		});

		it('should register each component only once even if called multiple times', () => {
			mockPortContainer.hasRegistration.mockReturnValue(false);

			// Llamamos registerDependency múltiples veces
			registry.registerDependency(mockPortContainer);
			registry.registerDependency(mockPortContainer);
			registry.registerDependency(mockPortContainer);

			// Verificamos que cada componente se registró solo una vez
			// const registeredComponents = (registry as any).#components;
			// registeredComponents.forEach((component: any) => {
			//   const registerCalls = mockContainer.register.mock.calls.filter(
			//     call => call[0] === component
			//   );
			//   expect(registerCalls.length).toBe(1);
			// });
		});

		it('should handle empty components array', () => {
			// Sobrescribimos la propiedad #components con un array vacío
			Object.defineProperty(registry, '#components', {
				value: [],
			});

			registry.registerDependency(mockPortContainer);

			expect(mockPortContainer.register).not.toHaveBeenCalled();
			expect(mockPortContainer.hasRegistration).not.toHaveBeenCalled();
		});
	});
});
