import {
	IErrResponse,
	IHeadersValues,
	IOKResponse,
	IRequestParams,
	ITransactionParams,
	ITransactionValid,
	TFrameworkRequest,
	TResult,
	resultErr,
	resultOk,
} from '@nxms/core-main/domain';
import { AppServiceHeaders } from '../services';

export class SecurityClass<TFwReq extends IRequestParams> {
	private headerService: AppServiceHeaders;

	constructor() {
		this.headerService = AppServiceHeaders.getInstance();
	}

	// Valida headers antes de obtener la info

	public validateHeaders(
		request: TFrameworkRequest<TFwReq>
	): TResult<string, IErrResponse> {
		try {
			if (!request.headers) {
				return resultErr({ errType: 'headers' });
			}

			const validMandatoryHeaders = this.headerService.validateMandatory(
				request.headers
			);

			if (validMandatoryHeaders.isErr()) {
				return validMandatoryHeaders;
			}

			const validHeaders = this.headerService.validate(request.headers);

			if (validHeaders.isErr()) {
				return validHeaders;
			}

			return resultOk();
		} catch (error) {
			return resultErr(error);
		}
	}

	// Valida headers después de obtener la info

	public validateRoute(
		info: ITransactionValid
	): TResult<IHeadersValues, IErrResponse> {
		return this.headerService.validateRutaHeaders(info);
	}

	public emptyUseCase(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		return new Promise((resolve) => {
			resolve(resultOk('Función vacía').unwrap());
		});
	}
}

