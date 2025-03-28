// @monomod/core/tests/application/services/errors.service.spec.ts
import { IErrorMapping } from '@monomod/core/domain';
import { ServiceErrors } from '@monomod/core/application';
import { mockPortMessages } from '../../mocks';

describe('ServiceErrors', () => {
	let service: ServiceErrors;
	// let mockMessages: jest.Mocked<IPortMessages>;

	beforeEach(() => {
		jest.clearAllMocks();
		// mockMessages = createMockMessages();
		service = new ServiceErrors(mockPortMessages);
	});

	describe('normalize', () => {
		it('should translate message when messageKey is provided', () => {
			const errorInfo = {
				detail: 'test error',
				errType: 'invalid' as const,
				messageKey: 'test.error',
			};
			const translatedMessage = 'Error traducido';
			mockPortMessages.getMessage.mockReturnValue(translatedMessage);

			const result = service.normalize(errorInfo);

			expect(mockPortMessages.getMessage).toHaveBeenCalledWith(
				errorInfo.messageKey
			);
			expect((result as IErrorMapping).text).toBe(translatedMessage);
		});

		it('should return IErrorMapping when error is in that format', () => {
			const errorMapping: IErrorMapping = {
				detail: 'test error',
				errType: 'invalid',
				text: 'Error text',
			};

			const result = service.normalize(errorMapping);

			expect(result).toEqual(errorMapping);
		});

		it('should handle unknown error format', () => {
			const unknownError = 'Unknown error';

			const result = service.normalize({
				detail: unknownError,
				errType: 'nocatch',
			});

			expect(result).toHaveProperty('detail', unknownError);
			expect(result).toHaveProperty('errType', 'nocatch');
		});
	});
});
