import { IContainer, IServerComponent, TOKENS } from '@monomod/core/domain';
import { ServerMessagesService, ServerPort } from '../application';
import { ModuleBase } from '@monomod/core/application';
import { ServerController } from './server.controller';
import { appConfig } from '../domain/server.config';

export class ModuleServer extends ModuleBase {
	static components: IServerComponent[] = [
		{ isConstant: true, token: TOKENS.server.config, value: appConfig },
		{ token: TOKENS.server.IServerController, value: ServerController },
		{ token: TOKENS.server.IServer, value: ServerPort },
		{ token: TOKENS.services.IServiceMessages, value: ServerMessagesService },
	];

	static register(container: IContainer) {
		this.components.forEach((component) => {
			if (!container.hasRegistration(component.token)) {
				container.register(
					component.token,
					component.value,
					component.isConstant
				);
			}
		});
		return container;
	}
}
