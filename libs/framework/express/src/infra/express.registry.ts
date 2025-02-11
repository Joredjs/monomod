import { IPortContainer, IPortRegistry, SYMBOLS } from '@monomod/core/domain';
import { ExpressFactory } from '../application';

export class RegistryExpress implements IPortRegistry {
	#components = [
		{ token: SYMBOLS.framework.IFrameworkFactory, value: ExpressFactory },
	];

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
