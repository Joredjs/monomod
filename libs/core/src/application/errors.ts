import {
	IErrResponse,
	IErrorMapping,
} from '../domain';

// TODO: migrate from this file to errors.service

export function isIErrResponse(errInfo: unknown): errInfo is IErrResponse {
	return (
		errInfo !== null &&
		typeof errInfo === 'object' &&
		'code' in errInfo &&
		'error' in errInfo &&
		typeof errInfo.error === 'object' &&
		'detail' in errInfo.error &&
		'text' in errInfo.error
	);
}

export function isIErrorMapping(errInfo: unknown): errInfo is IErrorMapping {
	return (
		errInfo !== null &&
		typeof errInfo === 'object' &&
		'detail' in errInfo &&
		'errType' in errInfo
	);
}

export function normalizeError(
	errInfo: IErrorMapping | unknown
): IErrorMapping | IErrResponse {
	if (errInfo && typeof errInfo === 'object') {
		if (isIErrResponse(errInfo)) {
			// It's likely an IErrResponse
			return errInfo as IErrResponse;
		} else if (isIErrorMapping(errInfo)) {
			// It's likely an IErrorMap
			return errInfo as IErrorMapping;
		}
		// It's an object but not in the propper format
		const oldErr = errInfo;
		return {
			detail:
				typeof oldErr === 'string'
					? oldErr
					: JSON.stringify(oldErr, Object.getOwnPropertyNames(oldErr)),
			errType: 'nocatch',
		};
	}

	// Fallback for unknown error formats
	return {
		detail: typeof errInfo === 'string' ? errInfo : JSON.stringify(errInfo),
		errType: 'nocatch',
	};
}
