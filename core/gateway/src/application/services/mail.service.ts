import nodemailer from 'nodemailer';

export class AppServiceMailer {
	private transporter;

	private mailOptions: {
		from?: string;
		to?: string;
		subject?: string;
		html?: string;
	} = {};

	constructor() {
		const config = {
			auth: {
				pass: process.env.MAIL_PASS,
				user: process.env.MAIL_USER,
			},
			host: 'smtp-mail.outlook.com',
			port: 587,
			secure: false,
		};

		this.transporter = nodemailer.createTransport(config);

		this.mailOptions.from = process.env.MAIL_USER || 'noreply@mail.com';
	}

	send(para: string, asunto: string, cuerpo: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.mailOptions = {
				from: this.mailOptions.from,
				html: cuerpo,
				subject: asunto,
				to: para,
			};

			this.transporter
				.sendMail(this.mailOptions)
				.then(() => {
					resolve('mensaje enviado');
				})
				.catch((error) => {
					console.error('Error al enviar el correo');
					reject(error);
				});
		});
	}
}

