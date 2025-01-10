import { IMessageConfig } from '@monomod/core/domain';
import { ServiceMessages } from '@monomod/core/application';
import { messageConfig } from '../domain/message.config';

export class ServerMessagesService extends ServiceMessages {
	protected getMessageConfig(): IMessageConfig {
		return messageConfig;
	}
}
