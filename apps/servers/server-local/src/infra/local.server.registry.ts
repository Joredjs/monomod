import {
	IContainerComponent,
	IPortContainer,
	IPortRegistry,
	SYMBOLS,
} from '@monomod/core/domain';
import { localServerConfig } from '../domain';

export class RegistryServerLocal implements IPortRegistry {
	#components: IContainerComponent[] = [
		{
			isConstant: true,
			token: SYMBOLS.server.IServerConfig,
			value: localServerConfig,
		},
	];

	getName(): string {
		return this.constructor.name;
	}

	registerDependency(container: IPortContainer): void {
		this.#components.forEach((component) => {
			const isRegistered = container.hasRegistration(component.token);
			if (!isRegistered) {
				container.register(component);
			}
		});
	}
}
