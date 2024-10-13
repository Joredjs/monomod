import { domainKeys, mocks } from '../domain';
import { ResponseResult } from './response';
import { ServiceLogs } from './services';

function assertResultOk(responseResult: ResponseResult, value, expected) {
	const result = responseResult.resultOk(value);
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toEqual({
		body: expected,
		code: domainKeys.httpCodes[200].code,
	});
}

function assertResultErr(
	responseResult: ResponseResult,
	mock,
	showDetail = true
) {
	const result = responseResult.resultErr(mock);
	expect(result.isErr()).toBe(true);
	expect(result.unwrap()).toEqual({
		code: domainKeys.errores[mock.errType].code,
		error: {
			detail: showDetail ? mock.detail : domainKeys.errores.nodetail.text,
			text: mock.text ? mock.text : domainKeys.errores[mock.errType].text,
		},
	});
}

function assertLogSpy(logSpy: jest.SpyInstance, mock) {
	expect(logSpy).toHaveBeenCalledWith(expect.objectContaining(mock));
}

describe('ResponseResult', () => {
	let responseResult: ResponseResult = new ResponseResult();

	beforeEach(() => {
		responseResult = new ResponseResult();
	});
	describe('resultOk', () => {
		it('should return a successful Result with the provided value', () => {
			const value = 'test-value';
			assertResultOk(responseResult, value, value);
		});

		it('should return a successful Result with "OK" as the body when no value is provided', () => {
			assertResultOk(responseResult, '', 'OK');
		});
	});

	describe('resultErr', () => {
		let logSpy: jest.SpyInstance = jest.spyOn(ServiceLogs.prototype, 'save');

		beforeEach(() => {
			// Create a spy for the ServiceLogs.save method
			logSpy = jest.spyOn(ServiceLogs.prototype, 'save');
		});

		afterEach(() => {
			// Restore the original ServiceLogs.save method
			logSpy.mockRestore();
		});

		it('should return an error Result with the provided error information', () => {
			assertResultErr(responseResult, mocks.errIErrorMapping);
			assertLogSpy(logSpy, mocks.errIErrorMapping);
		});
		it('should use the provided error text if available', () => {
			assertResultErr(responseResult, mocks.errIErrorMappingText);
			assertLogSpy(logSpy, mocks.errIErrorMappingText);
		});
		it('should set showDetail to true by default', () => {
			assertResultErr(responseResult, mocks.errIErrorMapping);
			assertLogSpy(logSpy, mocks.errIErrorMapping);
		});
		it('should use the provided showDetail value', () => {
			assertResultErr(
				responseResult,
				mocks.errIErrorMappingNoShowDetail,
				false
			);
			assertLogSpy(logSpy, mocks.errIErrorMappingNoShowDetail);
		});
		it('should set saveLog to true by default', () => {
			const result = responseResult.resultErr(mocks.errIErrorMapping);
			expect(result.isErr()).toBe(true);
			assertLogSpy(logSpy, mocks.errIErrorMapping);
		});
		it('should use the provided saveLog value', () => {
			const result = responseResult.resultErr(mocks.errIErrorMappingNoLog);
			expect(result.isErr()).toBe(true);
			expect(logSpy).not.toHaveBeenCalled();
		});

		/* It('should return a normalized error when an IErrResponse is passed', () => {
		   	const result = responseResult.resultErr(mocks.errIErrResponse);
		   	expect(result.isErr()).toBe(true);
		   	expect(result.unwrap()).toEqual(mocks.errIErrResponse);
		   }); */
	});
});
