import { AdapterExpress } from '@monomod/framework-express/infra';
import { IExpressApps } from '@monomod/framework-express/domain';
import { ServerLocal } from './server';
import { appConfig } from './config';
import { getLanguageTexts } from '@monomod/core/domain';

try {
	const server = new ServerLocal();
	const framework = new AdapterExpress(appConfig);

	// Retrieve the configured microapps
	const microApps: IExpressApps = framework.getApps();
	// Iterate through the microapps and start each server
	Object.values(microApps).forEach((microApp) => {
		server.start(microApp);
	});
} catch (error) {
	console.error(`${getLanguageTexts('appsServerErrCreating')}:`, error);
}
