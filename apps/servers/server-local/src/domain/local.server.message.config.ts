import {
	EMessageGroup,
	EMessageType,
	IMessageConfig,
} from '@monomod/core/domain';

export const messageConfig: IMessageConfig = {
	group: EMessageGroup.SERVER,
	keys: [
		{ key: 'listen', type: EMessageType.INFO },
		{ key: 'create', type: EMessageType.ERROR },
		{ key: 'start', type: EMessageType.ERROR },
		{ key: 'stop', type: EMessageType.ERROR },
		{ key: 'configuration', type: EMessageType.ERROR },
	],
};
