import { IPortLogs, IPortMessages, TOKENS } from '@monomod/core/domain';
import { Inject, Injectable, ServiceLogs } from '@monomod/core/application';

@Injectable(TOKENS.server.ServiceLogsServer)
export class ServiceLogsServer extends ServiceLogs implements IPortLogs {
	constructor(
		@Inject(TOKENS.server.ServiceMessagesServer) messages: IPortMessages
	) {
		super(messages);
	}
}
