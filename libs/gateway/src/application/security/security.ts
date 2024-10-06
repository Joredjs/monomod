import {
	IErrResponse,
	IOKResponse,
	IRequestParams,
	IServices,
	ITransactionValid,
	TFrameworkRequest,
	normalizeError,
	resultErr,
} from '@nxms/core/domain';

export class SecurityClass<TFwReq extends IRequestParams> {
	#headerService: IServices['headers'];

	constructor(headerService: IServices['headers']) {
		this.#headerService = headerService;
	}

	// Valida headers antes de obtener la info

	public validateHeaders(request: TFrameworkRequest<TFwReq>): boolean {
		try {
			if (!request.headers) {
				throw normalizeError({ errType: 'headers' });
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
		if (this.#headerService.validateRutaHeaders(info)) {
			return true;
		}
		return false;
	}

	public emptyHandler(): Promise<IOKResponse<string> | IErrResponse> {
		return new Promise((resolve) => {
			resolve(
				resultErr({
					detail: 'Empty handler',
					errType: 'badConfigured',
					text: "The use case doesn't exists",
				}).unwrap()
			);
		});
	}
}
