import { IServerConfig } from '@monomod/core/domain';

export const localServerConfig: IServerConfig = {
	addDomainName: true,
	bodyLimit: '5mb',
	debug: { container: false, cors: true, paths: true, routes: true },
};
