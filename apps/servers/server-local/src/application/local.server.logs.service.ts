import { IPortLogs, IPortMessages, SYMBOLS } from '@monomod/core/domain';
import { Inject, Injectable, ServiceLogs } from '@monomod/core/application';

@Injectable(SYMBOLS.server.ServiceLogsServer)
export class ServiceLogsServer extends ServiceLogs implements IPortLogs {
	constructor(
		@Inject(SYMBOLS.server.ServiceMessagesServer) messages: IPortMessages
	) {
		super(messages);
	}
}
