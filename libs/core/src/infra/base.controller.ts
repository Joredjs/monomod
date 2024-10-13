import {
	IAppValidations,
	IController,
	IErrResponse,
	IFrameworkService,
	IOKResponse,
	IResponseResult,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	domainKeys,
} from '../domain';

export class BaseController<TFwReq, TFwRes> implements IController<TFwReq, TFwRes> {
	validations: IAppValidations<TFwReq, TFwRes>;

	framework: IFrameworkService<TFwRes>;

	response: IResponseResult;

	constructor(
		Validations: IAppValidations<TFwReq, TFwRes>,
		frameworkService: IFrameworkService<TFwRes>,
		response: IResponseResult
	) {
		this.validations = Validations;
		this.framework = frameworkService;
		this.response = response;
	}

	public handler = async (
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	) => {
		try {
			const info: ITransactionValid = this.validations.manager(req, res);
			const handlerResponse = await this.#executeHandler(info);
			this.#returnResponse(res, handlerResponse.code, handlerResponse);
		} catch (error) {
			this.#handleError(res, error);
		}
	};

	async #executeHandler(
		info: ITransactionValid
	): Promise<IOKResponse<unknown> | IErrResponse> {
		try {
			return (await info.handler(info)) as IOKResponse<unknown>;
		} catch (err: unknown) {
			const handlerErr = err as IErrResponse;
			handlerErr.code ??= domainKeys.errores.nocatch.code;
			throw handlerErr;
		}
	}

	#returnResponse(
		res: TFrameworkResponse<TFwRes>,
		statusCode: number,
		responseBody: IOKResponse<unknown> | IErrResponse
	): void {
		const resInfo = {
			resBody: responseBody,
			resInstance: res,
			status: statusCode,
		};
		this.framework.returnInfo(resInfo);
	}

	#handleError(res: TFrameworkResponse<TFwRes>, error): void {
		const errorInfo = this.response.resultErr(error).unwrap();
		this.#returnResponse(res, errorInfo.code, errorInfo);
	}
}
