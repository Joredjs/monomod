import { ServerMessagesService } from '../../src/application/server.messages.service';
import { messageConfig } from '../../src/domain/message.config';
import { IServiceI18n } from '@monomod/core/domain';

describe('ServerMessagesService', () => {
	let service: ServerMessagesService;
	let mockI18n: jest.Mocked<IServiceI18n>;

	beforeEach(() => {
		mockI18n = {
			getText: jest.fn().mockImplementation(({ group, key, params }) => {
				return `translated-${group}-${key}-${params?.join('-')}`;
			}),
		} as unknown as jest.Mocked<IServiceI18n>;

		service = new ServerMessagesService(mockI18n);
	});

	it('should return message config', () => {
		const config = (service as any).getMessageConfig();
		expect(config).toBe(messageConfig);
	});

	it('should get message with parameters', () => {
		const message = service.getMessage('listen', ['test-app', '3000']);
		expect(mockI18n.getText).toHaveBeenCalled();
		expect(message).toContain('translated');
	});
});
