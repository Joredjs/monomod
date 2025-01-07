import {
	IErrResponse,
	IOKResponse,
	IRequestParams,
	IServices,
	ITransactionValid,
	TFrameworkRequest,
} from '@monomod/core/domain';
import { ResponseResult, normalizeError } from '@monomod/core/application';

export class SecurityClass<TFwReq extends IRequestParams> {
	#headerService: IServices['headers'];

	constructor(headerService: IServices['headers']) {
		this.#headerService = headerService;
	}

	// Valida headers antes de obtener la info

	public validateHeaders(request: TFrameworkRequest<TFwReq>): boolean {
		try {
			if (!request.headers) {
				throw normalizeError({ detail: request.headers, errType: 'headers' });
			}

			const validMandatoryHeaders = this.#headerService.validateMandatory(
				request.headers
			);

			if (validMandatoryHeaders) {
				return this.#headerService.validate(request.headers);
			}
			return false;
		} catch (error) {
			throw normalizeError(error);
		}
	}

	// Valida headers después de obtener la info

	public validateRoute(info: ITransactionValid): boolean {
		if (this.#headerService.validateRouteHeaders(info)) {
			return true;
		}
		return false;
	}

	// TODO: Is it correct this to be here?
	public emptyHandler(
		info: ITransactionValid
	): Promise<IOKResponse<string> | IErrResponse> {
		return new Promise((resolve) => {
			resolve(
				info.usecaseParams.response
					.resultErr({
						detail: 'Empty handler',
						errType: 'badConfigured',
						text: "The handler doesn't exists",
					})
					.unwrap()
			);
		});
	}
}
