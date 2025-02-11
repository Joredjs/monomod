import {
	IErrResponse,
	IErrorMapping,
} from '@monomod/core/domain';

export const mockErrorIErrResponse: IErrResponse = {
	code: 500,
	error: {
		detail: 'Something went wrong',
		text: 'An error occurred',
	},
};



const errIErrorMappingInvalid: IErrorMapping = {
	detail: 'Invalid input',
	errType: 'invalid',
};

const errIErrorMappingNoCatch: IErrorMapping = {
	detail: 'Unknown error',
	errType: 'nocatch',
};

const errIErrorMappingText: IErrorMapping = {
	...errIErrorMappingInvalid,
	text: 'The input is invalid',
};

const errIErrorMappingShowDetailNo: IErrorMapping = {
	...errIErrorMappingInvalid,
	showDetail: false,
};

const errIErrorMappingLogNo: IErrorMapping = {
	...errIErrorMappingInvalid,
	saveLog: false,
};

const errIErrorMappingLogYes: IErrorMapping = {
	...errIErrorMappingInvalid,
	saveLog: false,
};

const errObj = { message: 'Some error message' };
const errStr = 'Some error message';
const errNumber = 12345;
const errNoFormat = {
	code: 500,
	error: 'Something went wrong',
};
const errNoFormat2 = {
	code: 500,
};
const errNoFormat3 = {
	detail: 'Something went wrong',
};
const errNoFormat4 = {
	errType: 'invalid',
};

export const mockErrors = {
	errIErrResponse: mockErrorIErrResponse,
	errIErrorMappingInvalid,
	errIErrorMappingLogNo,
	errIErrorMappingLogYes,
	errIErrorMappingNoCatch,
	errIErrorMappingShowDetailNo,
	errIErrorMappingText,
	errNoFormat,
	errNoFormat2,
	errNoFormat3,
	errNoFormat4,
	errNumber,
	errObj,
	errStr,
};
