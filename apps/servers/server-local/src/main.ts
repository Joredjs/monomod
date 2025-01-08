import { Container } from '@monomod/core/application';
import { ServerController } from './controller';
import { appConfig } from './config';
import { domainKeys } from '@monomod/core/domain';

async function bootstrap() {
	const container = Container.getInstance();

	container
		.bind(domainKeys.core.container.frameworkconfig)
		.toConstantValue(appConfig);
	const serverManager = container.resolve(ServerController);
	await serverManager.deploy();
}

bootstrap().catch(console.error);
