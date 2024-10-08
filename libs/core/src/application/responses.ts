import {
	IErrResponse,
	IError,
	IErrorMapping,
	IOKResponse,
	Result,
	domainKeys,
} from '../domain';
import { ServiceLogs } from './services';

function isIErrResponse(errInfo: unknown): errInfo is IErrResponse {
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

function isIErrorMapping(errInfo: unknown): errInfo is IErrorMapping {
	return (
		errInfo !== null &&
		typeof errInfo === 'object' &&
		'detail' in errInfo &&
		'errType' in errInfo
	);
}

export function normalizeError(
	errInfo: unknown | IErrorMapping
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

function createErrorResponse(errInfo: IErrorMapping): IErrResponse {
	// Uncomment to show details only when it is active
	errInfo.showDetail = true;

	const msj: IError = domainKeys.errores[errInfo.errType];
	const detail = errInfo.showDetail
		? errInfo.detail
		: 'No está permitido ver el detalle del error';

	return {
		code: msj.code,
		error: {
			detail,
			text: errInfo.text || msj.text,
		},
	};
}

export function resultOk<T>(value?: T): Result<IOKResponse<T>, IErrResponse> {
	const res: IOKResponse<T> = {
		body: value || ('OK' as T),
		code: domainKeys.httpCodes[200].code,
	};
	return Result.resOk(res);
}

export function resultErr(errInfo: IErrorMapping): Result<any, IErrResponse> {
	errInfo.showDetail =
		typeof errInfo.showDetail === 'undefined' ? true : errInfo.showDetail;
	errInfo.saveLog =
		typeof errInfo.saveLog === 'undefined' ? true : errInfo.saveLog;

	if (errInfo && errInfo.saveLog) {
		// SaveLog(errInfo);
	}

	const normalizedError = normalizeError(errInfo);
	if (isIErrResponse(normalizedError)) {
		const res = normalizedError as IErrResponse;
		return Result.resErr(res);
	}
	const res = createErrorResponse(normalizedError);

	return Result.resErr(res);
}
