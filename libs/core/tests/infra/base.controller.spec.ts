import { mockResponseResult, mockServiceFramework } from '../mocks';
import { BaseController } from '@monomod/core/infra';

describe('BaseController', () => {
	let controller: BaseController<any, any>;
	const mockValidations = {
		manager: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		controller = new BaseController(
			mockValidations,
			mockServiceFramework,
			mockResponseResult
		);
	});

	describe('handler', () => {
		const mockRequest = { body: {} };
		const mockResponse = { locals: {} };

		it('should handle successful request', async () => {
			// Setup
			const mockTransactionInfo = {
				handler: jest.fn().mockResolvedValue({
					code: 200,
					body: 'success',
				}),
			};
			mockValidations.manager.mockReturnValue(mockTransactionInfo);

			// Act
			await controller.handler(mockRequest, mockResponse);

			// Assert
			expect(mockValidations.manager).toHaveBeenCalledWith(
				mockRequest,
				mockResponse
			);
			expect(mockTransactionInfo.handler).toHaveBeenCalledWith(
				mockTransactionInfo
			);
			expect(mockServiceFramework.returnInfo).toHaveBeenCalledWith({
				resBody: { code: 200, body: 'success' },
				resInstance: mockResponse,
				status: 200,
			});
		});
	});
});
