import { IErrResponse, IErrorMapping } from './result';

const errIErrResponse: IErrResponse = {
	code: 500,
	error: {
		detail: 'Something went wrong',
		text: 'An error occurred',
	},
};

const errIErrorMapping: IErrorMapping = {
	detail: 'Invalid input',
	errType: 'invalid',
};

const errIErrorMappingText: IErrorMapping = {
	...errIErrorMapping,
	text: 'The input is invalid',
};

const errIErrorMappingNoShowDetail: IErrorMapping = {
	...errIErrorMapping,
	showDetail: false,
};

const errIErrorMappingNoLog: IErrorMapping = {
	...errIErrorMapping,
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

export const mocks = {
	errIErrResponse,
	errIErrorMapping,
	errIErrorMappingNoLog,
	errIErrorMappingNoShowDetail,
	errIErrorMappingText,
	errNoFormat,
	errNoFormat2,
	errNoFormat3,
	errNoFormat4,
	errNumber,
	errObj,
	errStr,
};
