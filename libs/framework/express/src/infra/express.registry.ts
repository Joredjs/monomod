import { IPortContainer, IPortRegistry, TOKENS } from '@monomod/core/domain';
import { ExpressFactory } from '../application';

export class RegistryExpress implements IPortRegistry {
	#components = [
		{ token: TOKENS.framework.IFrameworkFactory, value: ExpressFactory },
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
