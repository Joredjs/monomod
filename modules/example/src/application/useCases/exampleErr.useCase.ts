import {
	IErrResponse,
	IOKResponse,
	IPortResponseResult,
	IServices,
	ITransactionParams,
	IUseCase,
	IUseCaseParams,
} from '@monomod/core/domain';

export class UseCaseExampleErr<TRepository> implements IUseCase<string> {
	#appServices: IServices;

	#response: IPortResponseResult;

	constructor(useCaseParams: IUseCaseParams<TRepository>) {
		this.#appServices = useCaseParams.services;
		this.#response = useCaseParams.response;
	}

	async execute(): Promise<IOKResponse<string> | IErrResponse> {
		const test = await this.#appServices.crypto.encrypt('test');
		console.debug('debugging', test);
		throw this.#response.resultErr('Example error').unwrap();
	}
}
