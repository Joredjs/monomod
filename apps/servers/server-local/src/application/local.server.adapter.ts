import {
	IFrameworkMicroApp,
	IPortErrors,
	IPortLogs,
	IPortServerAdapter,
	SYMBOLS,
} from '@monomod/core/domain';
import { Inject, Injectable } from '@monomod/core/application';

interface IAdapterParams {
	server: any;
	name: string;
}

@Injectable(SYMBOLS.server.IPortServerAdapter)
export class AdapterServerLocal implements IPortServerAdapter {
	constructor(
		@Inject(SYMBOLS.server.ServiceLogsServer) private logs: IPortLogs,
		@Inject(SYMBOLS.services.errors) private errors: IPortErrors
	) {}

	#validateMicroApp(microApp: IFrameworkMicroApp): void {
		if (!microApp) {
			throw this.errors.normalize({
				detail: microApp,
				errType: 'badConfigured',
				messageKey: 'configuration',
			});
		}
	}

	#createServer(microApp: IFrameworkMicroApp): IAdapterParams {
		// Starts a server per each microapp
		const { app, httpPort, name } = microApp;
		const server = app.listen(httpPort, () => {
			this.logs.debug({
				messageKey: 'listen',
				messageParams: [name, httpPort],
			});
		});
		return { name, server };
	}

	#configureServer(params: IAdapterParams) {
		this.#errorHandler(params);
		this.#gracefulShutdown(params);
	}

	#errorHandler(params: IAdapterParams): void {
		params.server.on('error', (err) => {
			this.logs.error({ messageKey: 'start', messageParams: [name, err] });
		});
	}

	#gracefulShutdown(params: IAdapterParams): void {
		const shutdown = async () => {
			try {
				await new Promise((resolve) => params.server.close(resolve));
				this.logs.debug({ messageKey: 'stop', messageParams: [params.name] });
				process.exit(0);
			} catch (error) {
				this.logs.error({
					messageKey: 'stop',
					messageParams: [params.name, error],
				});
				process.exit(1);
			}
		};

		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);
	}

	start(microApp: IFrameworkMicroApp): void {
		try {
			this.#validateMicroApp(microApp);
			const params = this.#createServer(microApp);
			this.#configureServer(params);
		} catch (error) {
			throw this.errors.normalize(error);
		}
	}
}
