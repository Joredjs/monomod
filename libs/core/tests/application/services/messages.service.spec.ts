import {
	EMessageGroup,
	EMessageType,
	IMessageConfig,
} from '@monomod/core/domain';
import { ServiceMessages } from '@monomod/core/application';

// Creamos una clase concreta para testing ya que ServiceMessages es abstracta
class TestServiceMessages extends ServiceMessages {
	protected getMessageConfig(): IMessageConfig {
		return {
			group: EMessageGroup.SERVER,
			keys: [
				{ key: 'test', type: EMessageType.INFO },
				{ key: 'error', type: EMessageType.ERROR },
			],
		};
	}
}

describe('ServiceMessages', () => {
	let service: TestServiceMessages;
	const mockI18n = {
		getText: jest.fn(),
		getCurrentLanguage: jest.fn(),
		setLanguage: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		service = new TestServiceMessages();
		// @ts-ignore - Inyectamos el mock
		service.i18n = mockI18n;
	});

	describe('getMessage', () => {
		it('should return translated message', () => {
			const expectedTranslation = 'Translated message';
			mockI18n.getText.mockReturnValue(expectedTranslation);

			const result = service.getMessage('test', ['param1']);

			expect(result).toBe(expectedTranslation);
			expect(mockI18n.getText).toHaveBeenCalledWith({
				group: EMessageGroup.SERVER,
				key: 'test',
				params: ['param1'],
				type: EMessageType.INFO,
			});
		});

		it('should throw error for invalid message key', () => {
			expect(() => service.getMessage('invalid', [])).toThrow();
		});

		it('should handle missing message key', () => {
			const invalidConfig: IMessageConfig = {
				group: EMessageGroup.SERVER,
				keys: [],
			};

			class InvalidServiceMessages extends ServiceMessages {
				protected getMessageConfig(): IMessageConfig {
					return invalidConfig;
				}
			}

			const invalidService = new InvalidServiceMessages();
			// @ts-ignore - Inyectamos el mock
			invalidService.i18n = mockI18n;

			expect(() => invalidService.getMessage('test', [])).toThrow();
		});
	});

	describe('getContext', () => {
		it('should return message group from config', () => {
			const result = service.getContext();
			expect(result).toBe(EMessageGroup.SERVER);
		});
	});

	describe('message validation', () => {
		it('should throw error for invalid message group', () => {
			class InvalidGroupService extends ServiceMessages {
				protected getMessageConfig(): IMessageConfig {
					return {
						group: 'invalid' as EMessageGroup,
						keys: [{ key: 'test', type: EMessageType.INFO }],
					};
				}
			}

			const invalidService = new InvalidGroupService();
			// @ts-ignore - Inyectamos el mock
			invalidService.i18n = mockI18n;

			expect(() => invalidService.getMessage('test', [])).toThrow();
		});

		it('should throw error for invalid message type', () => {
			class InvalidTypeService extends ServiceMessages {
				protected getMessageConfig(): IMessageConfig {
					return {
						group: EMessageGroup.SERVER,
						keys: [{ key: 'test', type: 'invalid' as EMessageType }],
					};
				}
			}

			const invalidService = new InvalidTypeService();
			// @ts-ignore - Inyectamos el mock
			invalidService.i18n = mockI18n;

			expect(() => invalidService.getMessage('test', [])).toThrow();
		});

		it('should validate empty keys array', () => {
			class EmptyKeysService extends ServiceMessages {
				protected getMessageConfig(): IMessageConfig {
					return {
						group: EMessageGroup.SERVER,
						keys: [],
					};
				}
			}

			const emptyService = new EmptyKeysService();
			// @ts-ignore - Inyectamos el mock
			emptyService.i18n = mockI18n;

			expect(() => emptyService.getMessage('test', [])).toThrow();
		});
	});
});
