import { AdapterServerLocal, ServiceLogsServer } from '../application';
import {
	IContainerComponent,
	IPortContainer,
	IPortRegistry,
	SYMBOLS,
} from '@monomod/core/domain';
import { ControllerServerLocal } from './local.server.controller';
import { localServerConfig } from '../domain';

export class RegistryServerLocal implements IPortRegistry {
	#components: IContainerComponent[] = [
		{
			token: SYMBOLS.server.IPortServerAdapter,
			value: AdapterServerLocal,
		},
		{
			token: SYMBOLS.server.IPortServerController,
			value: ControllerServerLocal,
		},
		{
			token: SYMBOLS.server.ServiceLogsServer,
			value: ServiceLogsServer,
		},
		{ isConstant: true, token: SYMBOLS.server.config, value: localServerConfig },
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
