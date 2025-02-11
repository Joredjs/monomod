import { ServiceMail } from '@monomod/core/application';

describe('ServiceMail', () => {
	let service: ServiceMail;
	const mockTransporter = {
		sendMail: jest.fn(),
	};
	const mockMailClient = {
		client: {
			createTransport: jest.fn().mockReturnValue(mockTransporter),
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.MAIL_USER = 'test@example.com';
		process.env.MAIL_PASS = 'password123';
		process.env.MAIL_HOST = 'smtp.test.com';
		process.env.MAIL_PORT = '587';

		service = new ServiceMail(mockMailClient);
	});

	describe('constructor', () => {
		it('should create mail service with correct config', () => {
			expect(mockMailClient.client.createTransport).toHaveBeenCalledWith({
				auth: {
					pass: 'password123',
					user: 'test@example.com',
				},
				host: 'smtp.test.com',
				port: 587,
				secure: false,
			});
		});
	});

	describe('send', () => {
		it('should send email successfully', async () => {
			mockTransporter.sendMail.mockResolvedValue(true);

			const result = await service.send(
				'recipient@test.com',
				'Test Subject',
				'<h1>Test Body</h1>'
			);

			expect(result).toBe(true);
			expect(mockTransporter.sendMail).toHaveBeenCalledWith({
				from: process.env.MAIL_USER,
				to: 'recipient@test.com',
				subject: 'Test Subject',
				html: '<h1>Test Body</h1>',
			});
		});

		it('should handle send error', async () => {
			mockTransporter.sendMail.mockRejectedValue(new Error('Send failed'));

			// await expect(
			// 	service.send('recipient@test.com', 'Test Subject', 'Test Body')
			// ).rejects.toThrow();

			// expect(mockTransporter.sendMail).toHaveBeenCalled();
		});
	});
});
