import { mockPortResponseResult, mockPortFrameworkService } from '../mocks';
import { BaseController } from '@monomod/core/infra';
import { mockTransactionInfo, mockValidations } from '../mocks/services.mock';

describe('BaseController', () => {
	let controller: BaseController<any, any>;

	beforeEach(() => {
		jest.clearAllMocks();
		controller = new BaseController(
			mockValidations,
			mockPortFrameworkService,
			mockPortResponseResult
		);
	});

	describe('handler', () => {
		const mockRequest = { body: {} };
		const mockResponse = { locals: {} };

		it('should handle successful request', async () => {
			mockValidations.manager.mockReturnValue(mockTransactionInfo);

			await controller.handler(mockRequest, mockResponse);

			expect(mockValidations.manager).toHaveBeenCalledWith(
				mockRequest,
				mockResponse
			);
			expect(mockTransactionInfo.handler).toHaveBeenCalledWith(
				mockTransactionInfo
			);
			expect(mockPortFrameworkService.returnInfo).toHaveBeenCalledWith({
				resBody: { code: 200, body: 'success' },
				resInstance: mockResponse,
				status: 200,
			});
		});
	});
});
