import {
	IErrResponse,
	IOKResponse,
	IServices,
	ITransactionParams,
	IUseCase,
} from '@nxms/core/domain';
import { resultErr, resultOk } from '@nxms/core/application';

export class TestUseCase implements IUseCase {
	#appServices: IServices;

	constructor(appServices: IServices) {
		this.#appServices = appServices;
	}

	async execute(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		try {
			// Do something
			return await resultOk('Test usecase').unwrap();
		} catch (error) {
			throw resultErr(error).unwrap();
		}
	}
}
