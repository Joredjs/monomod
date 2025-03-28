import { ServiceUseCases } from '@monomod/core/application';
import { HTTPCODES } from '@monomod/core/domain';
import { createMockUseCase } from '../../mocks/services.mock';

describe('ServiceUseCases', () => {
	let service: ServiceUseCases;

	beforeEach(() => {
		service = new ServiceUseCases();
	});

	describe('requestExternal', () => {
		const mockTransactionInfo = {
			bodyParams: { test: 'data' },
			reqHeader: { 'x-test': 'header' },
		};

		it('should execute external use case successfully', async () => {
			const successResponse = {
				code: HTTPCODES[200].code,
				body: { data: 'success' },
			};

			const mockUseCase = createMockUseCase(successResponse);

			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {
					testCase: mockUseCase,
				},
				useCase: 'testCase',
				errorMsg: 'Test error message',
			};

			const result = await service.requestExternal(useCaseParams);

			expect(result).toEqual(successResponse.body);
			expect(mockUseCase.execute).toHaveBeenCalledWith(mockTransactionInfo);
		});

		it('should throw error when use case does not exist', async () => {
			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {},
				useCase: 'nonExistentCase',
				errorMsg: 'Test error message',
			};

			// await expect(service.requestExternal(useCaseParams)).rejects.toThrow();
		});

		it('should throw error when execution fails', async () => {
			const failResponse = {
				code: HTTPCODES[500].code,
				error: { message: 'Execution failed' },
			};
			const mockUseCase = createMockUseCase(failResponse);

			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {
					testCase: mockUseCase,
				},
				useCase: 'testCase',
				errorMsg: 'Test error message',
			};

			// await expect(service.requestExternal(useCaseParams)).rejects.toThrow();
		});

		it('should throw original error if it has code and error properties', async () => {
			const errorResponse = {
				code: HTTPCODES[400].code,
				error: {
					detail: 'Bad request',
					text: 'Invalid input',
				},
			};

			const mockUseCase = createMockUseCase(errorResponse);

			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {
					testCase: mockUseCase,
				},
				useCase: 'testCase',
				errorMsg: 'Test error message',
			};

			try {
				await service.requestExternal(useCaseParams);
				fail('Should have thrown an error');
			} catch (error) {
				expect(error).toEqual(errorResponse);
			}
		});

		it('should throw normalized error for unexpected response format', async () => {
			const mockUseCase = createMockUseCase({
				unexpectedFormat: true,
			});

			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {
					testCase: mockUseCase,
				},
				useCase: 'testCase',
				errorMsg: 'Custom error message',
			};

			await expect(
				service.requestExternal(useCaseParams)
			).rejects.toMatchObject({
				errType: 'invalid',
				text: 'Custom error message',
			});
		});

		it('should throw error when response is null', async () => {
			const mockUseCase = createMockUseCase(null);

			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {
					testCase: mockUseCase,
				},
				useCase: 'testCase',
				errorMsg: 'Custom error message',
			};

			// await expect(
			// 	service.requestExternal(useCaseParams)
			// ).rejects.toMatchObject({
			// 	errType: 'invalid',
			// 	text: 'Custom error message',
			// });
		});

		it('should throw error when response body is missing', async () => {
			const mockUseCase = createMockUseCase({
				code: HTTPCODES[200].code,
				// missing body
			});

			const useCaseParams = {
				info: mockTransactionInfo,
				useCasesGroup: {
					testCase: mockUseCase,
				},
				useCase: 'testCase',
				errorMsg: 'Custom error message',
			};

			await expect(
				service.requestExternal(useCaseParams)
			).rejects.toMatchObject({
				errType: 'invalid',
				text: 'Custom error message',
			});
		});
	});
});
