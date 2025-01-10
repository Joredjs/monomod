import { IMessageConfig } from '@monomod/core/domain';

export const messageConfig: IMessageConfig = {
	group: 'server',
	keys: [
		{ key: 'listen', type: 'info' },
		{ key: 'create', type: 'errors' },
		{ key: 'start', type: 'errors' },
		{ key: 'stop', type: 'errors' },
	],
};
