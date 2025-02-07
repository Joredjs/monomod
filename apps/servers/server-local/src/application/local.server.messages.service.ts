import { IMessageConfig, IPortMessages, TOKENS } from '@monomod/core/domain';
import { Injectable, ServiceMessages } from '@monomod/core/application';
import { messageConfig } from '../domain';

@Injectable(TOKENS.server.ServiceMessagesServer)
export class ServiceMessagesServer
	extends ServiceMessages
	implements IPortMessages
{
	protected getMessageConfig(): IMessageConfig {
		return messageConfig;
	}
}
