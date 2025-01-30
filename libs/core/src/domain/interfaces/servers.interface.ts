export interface IContainerComponent {
	token: symbol;
	value: any;
	isConstant?: boolean;
}

export interface IServerConfig {
	addDomainName?: boolean;
	bodyLimit: string;
	debug?: {
		cors?: boolean;
		paths?: boolean;
		routes?: boolean;
	};
}
