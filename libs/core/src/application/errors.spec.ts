import { isIErrResponse, isIErrorMapping, normalizeError } from './errors';
import { mocks } from '../domain';


// #region helpers

function assertIsNotFormattedError(fnToCheck) {
	expect(fnToCheck(mocks.errNoFormat)).toBe(false);
	expect(fnToCheck(mocks.errNoFormat2)).toBe(false);
	expect(fnToCheck(null)).toBe(false);
	expect(fnToCheck(undefined)).toBe(false);
	expect(fnToCheck(mocks.errNoFormat3)).toBe(false);
	expect(fnToCheck(mocks.errNoFormat4)).toBe(false);
	expect(fnToCheck(mocks.errNumber)).toBe(false);
	expect(fnToCheck(mocks.errObj)).toBe(false);
	expect(fnToCheck(mocks.errStr)).toBe(false);
}

function assertIsIErrResponse() {
	expect(isIErrResponse(mocks.errIErrResponse)).toBe(true);
	expect(isIErrResponse(mocks.errIErrorMapping)).toBe(false);
	assertIsNotFormattedError(isIErrResponse);
}

function assertIsIErrorMapping() {
	expect(isIErrorMapping(mocks.errIErrorMapping)).toBe(true);
	expect(isIErrorMapping(mocks.errIErrResponse)).toBe(false);
	assertIsNotFormattedError(isIErrorMapping);
}

function assertNormalizeError(mock, expected) {
	expect(normalizeError(mock)).toEqual(expected);
}

// #endregion

// #region describes

describe('isIErrResponse', () => {
	it('should return true for valid IErrResponse objects', () => {
		expect(isIErrResponse(mocks.errIErrResponse)).toBe(true);
	});

	it('should return false for invalid objects', () => {
		assertIsIErrResponse();
	});
});

describe('isIErrorMapping', () => {
	it('should return true for valid IErrorMapping objects', () => {
		expect(isIErrorMapping(mocks.errIErrorMapping)).toBe(true);
	});

	it('should return false for invalid objects', () => {
		assertIsIErrorMapping();
	});
});

describe('normalizeError', () => {
	it('should return the same IErrResponse if already in the correct format', () => {
		assertNormalizeError(mocks.errIErrResponse, mocks.errIErrResponse);
	});

	it('should return the same IErrorMapping if already in the correct format', () => {
		assertNormalizeError(mocks.errIErrorMapping, mocks.errIErrorMapping);
	});

	it('should convert an object to IErrorMapping with "nocatch" errType if it is not in the correct format', () => {
		const expected = {
			detail: JSON.stringify(
				mocks.errObj,
				Object.getOwnPropertyNames(mocks.errObj)
			),
			errType: 'nocatch',
		};
		assertNormalizeError(mocks.errObj, expected);
	});

	it('should convert a string to IErrorMapping with "nocatch" errType', () => {
		const expected = {
			detail: mocks.errStr,
			errType: 'nocatch',
		};
		assertNormalizeError(mocks.errStr, expected);
	});

	it('should convert an unknown error format to IErrorMapping with "nocatch" errType', () => {
		const expected = {
			detail: JSON.stringify(mocks.errNumber),
			errType: 'nocatch',
		};
		assertNormalizeError(mocks.errNumber, expected);
	});
});

// #endregion
