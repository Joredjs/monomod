import { IPortContainer, IPortRegistry } from '../domain';

export class RegistryCore implements IPortRegistry {
	#components = [];

	getName(): string {
		return this.constructor.name;
	}

	registerDependency(container: IPortContainer): void {
		this.#components.forEach((component) => {
			if (!container.hasRegistration(component.token)) {
				container.register(component);
			}
		});
		// Return container;
	}
}
