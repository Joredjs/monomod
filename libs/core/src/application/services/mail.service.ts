import {
	IMailClient,
	IMailConfig,
	IMailOptions,
} from '../../domain';
import { normalizeError } from '../errors';

export class ServiceMail {
	#transporter;

	#client: IMailClient;

	#mailOptions: IMailOptions = {};

	constructor(client: IMailClient) {
		this.#client = client;
		const config: IMailConfig = {
			auth: {
				pass: process.env.MAIL_PASS,
				user: process.env.MAIL_USER,
			},
			host: process.env.MAIL_HOST,
			port: Number(process.env.MAIL_PORT),
			secure: false,
		};

		this.#transporter = this.#client.client.createTransport(config);

		this.#mailOptions.from = process.env.MAIL_USER;
	}

	async send(para: string, asunto: string, cuerpo: string): Promise<boolean> {
		try {
			this.#mailOptions = {
				from: this.#mailOptions.from,
				html: cuerpo,
				subject: asunto,
				to: para,
			};

			await this.#transporter.sendMail(this.#mailOptions);
			return true;
		} catch (error) {
			// Console.error('Error al enviar el correo');
			throw normalizeError(error);
		}
	}
}
