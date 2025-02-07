import {
	IPortContainer,
	IPortServerController,
	TOKENS,
} from '@monomod/core/domain';
import { ProjectRegisterServerLocal } from './infra';
import { ServiceErrors } from '@monomod/core/application';
import { ServiceMessagesServer } from './application';

async function bootstrap() {
	const container: IPortContainer =
		new ProjectRegisterServerLocal().initialize();

	const serverController = container.resolve<IPortServerController>(
		TOKENS.server.IPortServerController
	);
	await serverController.deploy();
}

bootstrap().catch((error) => {
	const errors = new ServiceErrors(new ServiceMessagesServer());
	console.error(errors.normalize(error));
});
