import {
	IErrResponse,
	IError,
	IErrorMapping,
	IOKResponse,
	Result,
	TResultErr,
	TResultOK,
	domainKeys,
} from '../domain';
import { isIErrResponse, isIErrorMapping, normalizeError } from './errors';
import { ServiceLogs } from './services';

export class ResponseResult {
	#logs: ServiceLogs;

	constructor() {
		this.#logs = new ServiceLogs();
	}

	#createErrorResponse(errInfo: IErrorMapping): IErrResponse {
		const msj: IError = domainKeys.errores[errInfo.errType];
		const detail = errInfo.showDetail
			? errInfo.detail
			: domainKeys.errores.nodetail.text;

		return {
			code: msj.code,
			error: {
				detail,
				text: errInfo.text || msj.text,
			},
		};
	}

	resultOk<T>(value?: T): TResultOK<T> {
		const res: IOKResponse<T> = {
			body: value || ('OK' as T),
			code: domainKeys.httpCodes[200].code,
		};
		return Result.resOk(res);
	}

	resultErr(errInfo: IErrorMapping): TResultErr {
		const normalizedError = normalizeError(errInfo);

		if (isIErrResponse(normalizedError)) {
			const res = normalizedError as IErrResponse;
			return Result.resErr(res);
		}

		if (isIErrorMapping(normalizedError)) {
			normalizedError.showDetail =
				typeof normalizedError.showDetail === 'undefined'
					? true
					: normalizedError.showDetail;
			normalizedError.saveLog =
				typeof normalizedError.saveLog === 'undefined'
					? true
					: normalizedError.saveLog;

			if (normalizedError && normalizedError.saveLog) {
				this.#logs.save(normalizedError);
			}

			const res = this.#createErrorResponse(normalizedError);
			return Result.resErr(res);
		}

		const res: IErrResponse = {
			code: domainKeys.httpCodes['500'].code,
			error: normalizedError,
		};
		return Result.resErr(res);
	}
}
