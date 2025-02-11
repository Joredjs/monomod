import {
	isIErrResponse,
	isIErrorMapping,
	normalizeError,
} from '@monomod/core/application';
import { mockErrors } from '../mocks/errors.mock';

// #region helpers

function assertIsNotFormattedError(fnToCheck) {
	expect(fnToCheck(mockErrors.errNoFormat)).toBe(false);
	expect(fnToCheck(mockErrors.errNoFormat2)).toBe(false);
	expect(fnToCheck(null)).toBe(false);
	expect(fnToCheck(undefined)).toBe(false);
	expect(fnToCheck(mockErrors.errNoFormat3)).toBe(false);
	expect(fnToCheck(mockErrors.errNoFormat4)).toBe(false);
	expect(fnToCheck(mockErrors.errNumber)).toBe(false);
	expect(fnToCheck(mockErrors.errObj)).toBe(false);
	expect(fnToCheck(mockErrors.errStr)).toBe(false);
}

function assertIsIErrResponse() {
	expect(isIErrResponse(mockErrors.errIErrResponse)).toBe(true);
	expect(isIErrResponse(mockErrors.errIErrorMappingInvalid)).toBe(false);
	assertIsNotFormattedError(isIErrResponse);
}

function assertIsIErrorMapping() {
	expect(isIErrorMapping(mockErrors.errIErrorMappingInvalid)).toBe(true);
	expect(isIErrorMapping(mockErrors.errIErrResponse)).toBe(false);
	assertIsNotFormattedError(isIErrorMapping);
}

function assertNormalizeError(mock, expected) {
	expect(normalizeError(mock)).toEqual(expected);
}

// #endregion

// #region describes

describe('isIErrResponse', () => {
	it('should return true for valid IErrResponse objects', () => {
		expect(isIErrResponse(mockErrors.errIErrResponse)).toBe(true);
	});

	it('should return false for invalid objects', () => {
		assertIsIErrResponse();
	});
});

describe('isIErrorMapping', () => {
	it('should return true for valid IErrorMapping objects', () => {
		expect(isIErrorMapping(mockErrors.errIErrorMappingInvalid)).toBe(true);
	});

	it('should return false for invalid objects', () => {
		assertIsIErrorMapping();
	});
});

describe('normalizeError', () => {
	it('should return the same IErrResponse if already in the correct format', () => {
		assertNormalizeError(
			mockErrors.errIErrResponse,
			mockErrors.errIErrResponse
		);
	});

	it('should return the same IErrorMapping if already in the correct format', () => {
		assertNormalizeError(
			mockErrors.errIErrorMappingInvalid,
			mockErrors.errIErrorMappingInvalid
		);
	});

	it('should convert an object to IErrorMapping with "nocatch" errType if it is not in the correct format', () => {
		const expected = {
			detail: JSON.stringify(
				mockErrors.errObj,
				Object.getOwnPropertyNames(mockErrors.errObj)
			),
			errType: 'nocatch',
		};
		assertNormalizeError(mockErrors.errObj, expected);
	});

	it('should convert a string to IErrorMapping with "nocatch" errType', () => {
		const expected = {
			detail: mockErrors.errStr,
			errType: 'nocatch',
		};
		assertNormalizeError(mockErrors.errStr, expected);
	});

	it('should convert an unknown error format to IErrorMapping with "nocatch" errType', () => {
		const expected = {
			detail: JSON.stringify(mockErrors.errNumber),
			errType: 'nocatch',
		};
		assertNormalizeError(mockErrors.errNumber, expected);
	});
});

// #endregion
