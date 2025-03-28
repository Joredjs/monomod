import { ERRORS, HTTPCODES } from '@monomod/core/domain';
import { createMockIErrorMapping, mockPortLogs } from '../mocks';
import { ResponseResult } from '@monomod/core/application';

describe('ResponseResult', () => {
	let responseResult: ResponseResult;

	beforeEach(() => {
		jest.clearAllMocks();
		responseResult = new ResponseResult();
		// @ts-ignore - Inyectamos el mock del servicio de logs
		responseResult.logs = mockPortLogs;
	});

	describe('resultOk', () => {
		it('should create successful response', () => {
			const value = { data: 'test' };
			const result = responseResult.resultOk(value);

			const unwrapped = result.unwrap();
			expect(unwrapped).toEqual({
				body: value,
				code: HTTPCODES[200].code,
			});
		});

		it('should create successful response with default value when no value provided', () => {
			const result = responseResult.resultOk();

			const unwrapped = result.unwrap();
			expect(unwrapped).toEqual({
				body: 'OK',
				code: HTTPCODES[200].code,
			});
		});
	});

	describe('resultErr', () => {
		it('should create error response with IErrorMapping input', () => {
			const errorInfo = createMockIErrorMapping('invalid');
			const result = responseResult.resultErr(errorInfo);

			const unwrapped = result.unwrap();
			expect(unwrapped.code).toBe(ERRORS.invalid.code);
			expect(unwrapped.error).toEqual({
				detail: errorInfo.detail,
				text: errorInfo.text,
			});
		});

		it('should create error response with unknown error input', () => {
			const errorInfo = createMockIErrorMapping('nocatch');
			const result = responseResult.resultErr(errorInfo);

			const unwrapped = result.unwrap();
			expect(unwrapped.code).toBe(ERRORS.nocatch.code);
			expect(unwrapped.error.detail).toContain('Unknown error');
		});

		it('should log error when saveLog is true', () => {
			const errorInfo = createMockIErrorMapping('invalid', true);
			responseResult.resultErr(errorInfo);
			expect(mockPortLogs.saveError).toHaveBeenCalledWith(errorInfo);
		});

		it('should not show detail when showDetail is false', () => {
			const errorInfo = createMockIErrorMapping('badInfo', true, false);

			const result = responseResult.resultErr(errorInfo);

			const unwrapped = result.unwrap();
			expect(unwrapped.error.detail).toBe(ERRORS.nodetail.text);
		});
	});
});
