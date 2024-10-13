import { ExpressFramework } from '@nxms/framework-express/infra';
import { IExpressApps } from '@nxms/framework-express/domain';
import { LocalServer } from './server';
import { appConfig } from './config';
import { getLanguageTexts } from '@nxms/core/domain';

try {
	const localServer = new LocalServer();
	const framework = new ExpressFramework(appConfig);

	// Retrieve the configured microapps
	const microApps: IExpressApps = framework.getApps();
	// Iterate through the microapps and start each server
	Object.values(microApps).forEach((microApp) => {
		localServer.start(microApp);
	});
} catch (error) {
	console.error(`${getLanguageTexts('appsServerErrCreating')}:`, error);
}
