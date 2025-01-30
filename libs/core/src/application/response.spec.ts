import { ERRORS, HTTPCODES, mocks } from '../domain';
import { ResponseResult } from './response';
import { ServiceLogs } from './services';

function assertResultOk(responseResult: ResponseResult, value, expected) {
	const result = responseResult.resultOk(value);
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toEqual({
		body: expected,
		code: HTTPCODES[200].code,
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
		code: ERRORS[mock.errType].code,
		error: {
			detail: showDetail ? mock.detail : ERRORS.nodetail.text,
			text: mock.text ? mock.text : ERRORS[mock.errType].text,
		},
	});
}

function assertLogSpy(logSpy: jest.SpyInstance, mock) {
	expect(logSpy).toHaveBeenCalledWith(expect.objectContaining(mock));
}

function testResultOk(responseResult: ResponseResult) {
	it('should return a successful Result with the provided value', () => {
		const value = 'test-value';
		assertResultOk(responseResult, value, value);
	});

	it('should return a successful Result with "OK" as the body when no value is provided', () => {
		assertResultOk(responseResult, '', 'OK');
	});
}

function testResultErr(
	responseResult: ResponseResult,
	logSpy: jest.SpyInstance
) {
	beforeEach(() => {
		logSpy = jest.spyOn(ServiceLogs.prototype, 'saveError');
	});

	afterEach(() => {
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
		assertResultErr(responseResult, mocks.errIErrorMappingNoShowDetail, false);
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
}

describe('ResponseResult', () => {
	/* Const serviceLogs = {
	   	debug: jest.fn(),
	   	error: jest.fn(),
	   	saveError: jest.fn(),
	   	serverConfig: {
	   		showDetail: true,
	   	},
	   } as unknown as jest.Mocked<ServiceLogs>; */

	const logSpy: jest.SpyInstance = jest.spyOn(
		ServiceLogs.prototype,
		'saveError'
	);
	let responseResult: ResponseResult = new ResponseResult();

	beforeEach(() => {
		responseResult = new ResponseResult();
		jest.clearAllMocks();
	});

	describe('resultOk', () => {
		testResultOk(responseResult);
	});

	/* Describe('resultErr', () => {
	   	testResultErr(responseResult, logSpy);
	   }); */
});
