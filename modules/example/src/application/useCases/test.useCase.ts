import {
	IServices,
	IErrResponse,
	IOKResponse,
	ITransactionParams,
	IUseCase,
	resultErr,
	resultOk,
} from '@nxms/core-main/domain';

export class TestUseCase implements IUseCase {
	#appServices: IServices;

	constructor(appServices: IServices) {
		this.#appServices = appServices;
	}

	async execute(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		try {
			// do something
			return resultOk('Test usecase').unwrap();
		} catch (error) {
			throw resultErr(error).unwrap();
		}
	}
}
