export interface IServer {
	start(microApp: any): void;
}

export interface IServerController {
	deploy(): void;
}

export interface IServerComponent {
	token: symbol;
	value: any;
	isConstant?: boolean;
}
