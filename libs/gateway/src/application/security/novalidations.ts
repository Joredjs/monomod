import {
	IAppValidations,
	IRequestParams,
	IServices,
	ITransactionValid,
	TFrameworkRequest,
} from '@nxms/core/domain';
import { SecurityClass } from './security';

export class NoValidations<TFwReq extends IRequestParams, TFwRes>
	implements IAppValidations<TFwReq, TFwRes>
{
	#security: SecurityClass<TFwReq>;

	constructor(services: IServices) {
		this.#security = new SecurityClass<TFwReq>(services.headers);
	}

	#getTransactionInfo(req: TFrameworkRequest<TFwReq>): ITransactionValid {
		const useCase = this.#security.emptyUseCase;

		return {
			reqHeader: req.headers,
			useCase,
		};
	}

	public manager(req: TFrameworkRequest<TFwReq>): ITransactionValid {
		return this.#getTransactionInfo(req);
	}
}
