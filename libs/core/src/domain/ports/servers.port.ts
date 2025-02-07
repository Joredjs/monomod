import { IFrameworkMicroApp } from '../interfaces';
import { IPortContainer } from './container.port';
import { IPortFrameworkAdapter } from './frameworks.port';
import { IPortLogs } from './logs.port';
import { IPortMessages } from './messages.port';

export interface IPortServerAdapter {
	start(microApp: IFrameworkMicroApp): void;
}

export interface IPortServerController {
	deploy(): void;
}

export interface IPortServerControllerConfig {
	messages: IPortMessages;
	framework: IPortFrameworkAdapter;
	logsService: IPortLogs;
	serverPort: IPortServerAdapter;
}

export interface IPortServerRegister {
	initialize(): IPortContainer;
}
