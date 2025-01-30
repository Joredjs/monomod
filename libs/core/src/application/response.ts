import {
	ERRORS,
	HTTPCODES,
	IErrResponse,
	IError,
	IErrorMapping,
	IOKResponse,
	IPortLogs,
	Result,
	TOKENS,
	TResultErr,
	TResultOK,
} from '../domain';
import { isIErrResponse, isIErrorMapping, normalizeError } from './errors';
import { Inject } from './di';

export class ResponseResult {
	@Inject(TOKENS.services.logs) readonly logs: IPortLogs;

	/* Constructor() {
	   	// this.#logs = logs;
	   } */

	#createErrorResponse(errInfo: IErrorMapping): IErrResponse {
		const msj: IError = ERRORS[errInfo.errType];
		const detail = errInfo.showDetail ? errInfo.detail : ERRORS.nodetail.text;

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
			code: HTTPCODES[200].code,
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
				this.logs.saveError(normalizedError);
			}

			const res = this.#createErrorResponse(normalizedError);
			return Result.resErr(res);
		}

		const res: IErrResponse = {
			code: HTTPCODES['500'].code,
			error: normalizedError,
		};
		return Result.resErr(res);
	}
}
