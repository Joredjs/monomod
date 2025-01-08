import { IFrameworkAdapter, IServiceI18n } from '@monomod/core/domain';
import { Inject, Injectable, ServiceI18n } from '@monomod/core/application';
import { AdapterExpress } from '@monomod/framework-express/infra';
import { IExpressApps } from '@monomod/framework-express/domain';
import { ServerLocal } from './server';

@Injectable()
export class ServerController {
	constructor(
		@Inject(ServerLocal) private serverLocal: ServerLocal,
		@Inject(ServiceI18n) private i18n: IServiceI18n,
		@Inject(AdapterExpress) private adapterExpress: IFrameworkAdapter
	) {}

	deploy() {
		try {
			const server = this.serverLocal;
			const framework = this.adapterExpress;

			// Retrieve the configured microapps
			const microApps: IExpressApps = framework.getApps();
			// Iterate through the microapps and start each server
			Object.values(microApps).forEach((microApp) => {
				server.start(microApp);
			});
		} catch (error) {
			console.error(
				`${this.i18n.getText({
					group: 'server',
					key: 'creating',
					type: 'error',
				})}:`,
				error
			);
		}
	}

	async stop() {
		// Lógica de limpieza
	}
}
