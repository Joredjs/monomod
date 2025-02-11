import { EMessageGroup, EMessageType } from '../const';

export interface IMessageConfig {
	group: EMessageGroup;
	keys: Array<{
		key: string;
		type: EMessageType;
	}>;
}
