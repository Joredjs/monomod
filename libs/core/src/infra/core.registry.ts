import { IPortContainer, IPortRegistry, TOKENS } from '../domain';
import { ServiceErrors } from '../application/services/errors.service';

export class RegistryCore implements IPortRegistry {
	#components = [
		// { token: TOKENS.services.errors, value: ServiceErrors }
	];

	getName(): string {
		return this.constructor.name;
	}

	registerDependency(container: IPortContainer): IPortContainer {
		this.#components.forEach((component) => {
			if (!container.hasRegistration(component.token)) {
				container.register(component);
			}
		});
		return container;
	}
}
