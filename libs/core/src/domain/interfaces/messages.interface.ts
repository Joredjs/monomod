import { EMessageGroup, EMessageType } from '../const/messages.const';

export interface IMessageConfig {
	group: EMessageGroup;
	keys: Array<{
		key: string;
		type: EMessageType;
	}>;
}
