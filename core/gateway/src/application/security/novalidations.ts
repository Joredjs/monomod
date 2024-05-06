import {
	IAppValidations,
	IErrResponse,
	IRequestParams,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	TResult,
	resultOk,
} from '@nxms/core-main/domain';
import { SecurityClass } from './security';

export class NoValidations<TFwReq extends IRequestParams, TFwRes>
	implements IAppValidations<TFwReq, TFwRes>
{
	private security: SecurityClass<TFwReq>;

	constructor() {
		this.security = new SecurityClass<TFwReq>();
	}

	private getTransactionInfo(
		req: TFrameworkRequest<TFwReq>
	): ITransactionValid {
		const useCase = this.security.emptyUseCase;

		return {
			reqHeader: req.headers,
			useCase,
		};
	}

	public manager(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): TResult<ITransactionValid, IErrResponse> {
		const info = this.getTransactionInfo(req);
		return resultOk(info);
	}
}
