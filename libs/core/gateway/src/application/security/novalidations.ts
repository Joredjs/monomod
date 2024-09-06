import {
	IAppValidations,
	IRequestParams,
	ITransactionValid,
	TFrameworkRequest,
} from '@nxms/core-main/domain';
import { ServiceCrypto, ServiceHeaders } from '@nxms/core-main/application';
import { DataHeaders } from '../../domain';
import { SecurityClass } from './security';
import { clientCrypto } from "../../infra/dependencies";

export class NoValidations<TFwReq extends IRequestParams, TFwRes>
	implements IAppValidations<TFwReq, TFwRes>
{
	#security: SecurityClass<TFwReq>;

	constructor() {
		const infoHeaders = new DataHeaders();
		const headerService = ServiceHeaders.getInstance(
			infoHeaders.headers,
			ServiceCrypto.getInstance(clientCrypto)
		);
		this.#security = new SecurityClass<TFwReq>(headerService);
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
