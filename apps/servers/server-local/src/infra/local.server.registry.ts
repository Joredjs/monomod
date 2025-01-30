import {
	IContainerComponent,
	IPortContainer,
	IPortRegistry,
	TOKENS,
} from '@monomod/core/domain';
import { AdapterServerLocalExpress } from '../application';
import { ControllerServerLocal } from './local.server.controller';
import { localServerConfig } from '../domain';

export class RegistryServerLocal implements IPortRegistry {
	#components: IContainerComponent[] = [
		{
			token: TOKENS.server.IPortServerAdapter,
			value: AdapterServerLocalExpress,
		},
		{
			token: TOKENS.server.IPortServerController,
			value: ControllerServerLocal,
		},
		{ isConstant: true, token: TOKENS.server.config, value: localServerConfig },
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
