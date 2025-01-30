import {
	IPortContainer,
	IPortServerController,
	TOKENS,
} from '@monomod/core/domain';
import { ProjectRegisterServerLocal } from './infra/local.server.project.register';
import { normalizeError } from '@monomod/core/application';

async function bootstrap() {
	const container: IPortContainer =
		new ProjectRegisterServerLocal().initialize();

	const serverController = container.resolve<IPortServerController>(
		TOKENS.server.IPortServerController
	);
	await serverController.deploy();
}

bootstrap().catch((error) => {
	console.error(normalizeError(error));
});
