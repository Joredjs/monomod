import {
	EHttpMethods,
	EPrivacyLevel,
	EVersions,
	IErrorMapping,
	IRoute,
	ITransactionParams,
	TErroresValues,
	THttpMethods,
} from '@monomod/core/domain';

export const createMockIRoute = (
	method: THttpMethods,
	path: string,
	privacy: EPrivacyLevel[]
): IRoute => {
	return {
		globalHeaders: [],
		headers: [],
		method,
		path,
		privacy,
		schema: {},
		version: EVersions.alpha,
	};
};

export const createMockITransactionParams = (
	headers: {},
	privacy: EPrivacyLevel[]
): ITransactionParams => {
	return {
		bodyParams: {},
		reqHeader: headers,
		route: createMockIRoute(EHttpMethods.GET, 'test', privacy),
	};
};

export const createMockIErrorMapping = (
	errType: TErroresValues,
	showLog = true,
	showDetail = true
): IErrorMapping => {
	const errorInfo: IErrorMapping = {
		detail: 'No detail',
		errType: errType,
		text: 'No text',
	};
	switch (errType) {
		case 'nocatch':
			errorInfo.detail = 'Unknown error';
			break;
		case 'invalid':
			errorInfo.detail = 'Invalid input';
			break;

		default:
			break;
	}

	errorInfo.saveLog = showLog;
	errorInfo.showDetail = showDetail;
	return errorInfo;
};


export interface MockValidateFunction extends jest.Mock {
	errors?: Array<{
		keyword: string;
		message?: string;
		// otros campos que necesites
	}>;
}


