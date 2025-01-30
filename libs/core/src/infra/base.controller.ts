import {
	ERRORS,
	IAppValidations,
	IController,
	IErrResponse,
	IOKResponse,
	IPortFrameworkService,
	IPortResponseResult,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
} from '../domain';

export class BaseController<TFwReq, TFwRes>
	implements IController<TFwReq, TFwRes>
{
	validations: IAppValidations<TFwReq, TFwRes>;

	framework: IPortFrameworkService<TFwRes>;

	response: IPortResponseResult;

	constructor(
		Validations: IAppValidations<TFwReq, TFwRes>,
		frameworkService: IPortFrameworkService<TFwRes>,
		response: IPortResponseResult
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
			handlerErr.code ??= ERRORS.nocatch.code;
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
