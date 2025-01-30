import {
	IErrResponse,
	IOKResponse,
	IPortResponseResult,
	IServices,
	ITransactionParams,
	IUseCase,
	IUseCaseParams,
} from '@monomod/core/domain';

export class UseCaseExampleOk<TRepository> implements IUseCase<string> {
	#appServices: IServices;

	#response: IPortResponseResult;

	constructor(useCaseParams: IUseCaseParams<TRepository>) {
		this.#appServices = useCaseParams.services;
		this.#response = useCaseParams.response;
	}

	async execute(): Promise<IOKResponse<string> | IErrResponse> {
		try {
			// Do something
			return await this.#response.resultOk('Test usecase').unwrap();
		} catch (error) {
			throw this.#response.resultErr(error).unwrap();
		}
	}
}
