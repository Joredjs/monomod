import {
	IErrResponse,
	IOKResponse,
	IResponseResult,
	IServices,
	ITransactionParams,
	IUseCase,
	IUseCaseParams,
} from '@nxms/core/domain';

export class UseCaseExampleOk<TRepository> implements IUseCase {
	#appServices: IServices;

	#response: IResponseResult;

	constructor(useCaseParams: IUseCaseParams<TRepository>) {
		this.#appServices = useCaseParams.services;
		this.#response = useCaseParams.response;
	}

	async execute(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		try {
			// Do something
			return await this.#response.resultOk('Test usecase').unwrap();
		} catch (error) {
			throw this.#response.resultErr(error).unwrap();
		}
	}
}
