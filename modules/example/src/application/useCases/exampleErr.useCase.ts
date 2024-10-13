import {
	IErrResponse,
	IOKResponse,
	IResponseResult,
	IServices,
	ITransactionParams,
	IUseCase,
	IUseCaseParams,
} from '@nxms/core/domain';

export class UseCaseExampleErr<TRepository> implements IUseCase {
	#appServices: IServices;

	#response: IResponseResult;

	constructor(useCaseParams: IUseCaseParams<TRepository>) {
		this.#appServices = useCaseParams.services;
		this.#response = useCaseParams.response;
	}

	async execute(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		const test = await this.#appServices.crypto.encrypt('test');
		console.debug(test);
		throw this.#response.resultErr('Example error').unwrap();
	}
}
