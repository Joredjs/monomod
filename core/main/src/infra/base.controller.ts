import {
	IErrResponse,
	IOKResponse,
	IFrameworkService,
	TFrameworkRequest,
	TFrameworkResponse,
	IAppValidations,
	IController,
	domainKeys,
	resultErr,
} from '../domain';

export class BaseController<TFwReq, TFwRes> implements IController<TFwReq, TFwRes> {
	validations: IAppValidations<TFwReq, TFwRes>;

	framework: IFrameworkService<TFwRes>;

	constructor(
		Validations: IAppValidations<TFwReq, TFwRes>,
		frameworkService: IFrameworkService<TFwRes>
	) {
		this.validations = Validations;
		this.framework = frameworkService;
	}

	public handler = (
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	) => {
		//TODO: 2 chained try are neccesary? do await instead then
		try {
			try {
				const info = this.validations.manager(req, res);

				info
					.useCase(info)
					.then((useCaseResponse: IOKResponse<unknown>) => {
						const resInfo = {
							resBody: useCaseResponse,
							resInstance: res as TFwRes,
							status: useCaseResponse.code,
						};
						this.framework.returnInfo(resInfo);
					})
					.catch((useCaseErr: IErrResponse) => {
						const resErrInfo = {
							resBody: useCaseErr,
							resInstance: res as TFwRes,
							status: useCaseErr.code || domainKeys.errores.nocatch.code,
						};
						this.framework.returnInfo(resErrInfo);
					});
			} catch (error) {
				const infoError = resultErr(error).unwrap();
				const resErrInfo = {
					resBody: infoError,
					resInstance: res as TFwRes,
					status: infoError.code,
				};
				this.framework.returnInfo(resErrInfo);
			}
		} catch (error) {
			console.error('ERROR en handler', error);
			const resErrInfo = {
				resBody: {
					body: 'Por el momento no es posible acceder a la información',
					code: 500,
				},
				resInstance: res as TFwRes,
				status: 500,
			};
			this.framework.returnInfo(resErrInfo);
		}
	};
}
