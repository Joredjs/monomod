import { AdapterServerLocal, ServiceLogsServer } from '../application';
import {
	IContainerComponent,
	IPortContainer,
	IPortRegistry,
	TOKENS,
} from '@monomod/core/domain';
import { ControllerServerLocal } from './local.server.controller';
import { localServerConfig } from '../domain';

export class RegistryServerLocal implements IPortRegistry {
	#components: IContainerComponent[] = [
		{
			token: TOKENS.server.IPortServerAdapter,
			value: AdapterServerLocal,
		},
		{
			token: TOKENS.server.IPortServerController,
			value: ControllerServerLocal,
		},
		{
			token: TOKENS.server.ServiceLogsServer,
			value: ServiceLogsServer,
		},
		{ isConstant: true, token: TOKENS.server.config, value: localServerConfig },
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
