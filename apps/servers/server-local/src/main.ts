import { IServerController, TOKENS } from '@monomod/core/domain';
import { ModuleManager } from './infra/module.manager';
import { normalizeError } from '@monomod/core/application';

async function bootstrap() {
	const container = ModuleManager.initialize();

	const serverController = container.resolve<IServerController>(
		TOKENS.server.IServerController
	);
	await serverController.deploy();
}

bootstrap().catch((error) => {
	console.error(normalizeError(error));
});
