import {
	IAppValidations,
	IController,
	IErrResponse,
	IFrameworkService,
	IOKResponse,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	domainKeys,
	resultErr,
} from '../domain';

export class BaseController<TFwReq, TFwRes>
	implements IController<TFwReq, TFwRes>
{
	validations: IAppValidations<TFwReq, TFwRes>;

	framework: IFrameworkService<TFwRes>;

	constructor(
		Validations: IAppValidations<TFwReq, TFwRes>,
		frameworkService: IFrameworkService<TFwRes>
	) {
		this.validations = Validations;
		this.framework = frameworkService;
	}

	public handler = async (
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	) => {
		try {
			const info: ITransactionValid = this.validations.manager(req, res);
			const useCaseResponse = await this.#executeUseCase(info);
			this.#returnResponse(res, useCaseResponse.code, useCaseResponse);
		} catch (error) {
			this.#handleError(res, error);
		}
	};

	async #executeUseCase(
		info: ITransactionValid
	): Promise<IOKResponse<unknown> | IErrResponse> {
		try {
			return (await info.useCase(info)) as IOKResponse<unknown>;
		} catch (err: unknown) {
			const useCaseErr = err as IErrResponse;
			useCaseErr.code ??= domainKeys.errores.nocatch.code;
			throw useCaseErr;
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
		const errorInfo = resultErr(error).unwrap();
		this.#returnResponse(res, errorInfo.code, errorInfo);
	}
}
