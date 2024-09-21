export interface IMailOptions {
	from?: string;
	to?: string;
	subject?: string;
	html?: string;
}

export interface IMailConfig {
	auth: {
		pass: string;
		user: string;
	};
	host: string;
	port: number;
	secure: boolean;
}

export interface IMailClient {
	client: {
		createTransport(config: IMailConfig);
	};
}
