import {
	IAllUseCases,
	IErrResponse,
	IOKResponse,
	IPort,
	IPortParams,
	ITransactionParams,
	IUseCaseParams,
} from '@nxms/core/domain';
import { TestUseCase } from './useCases';

export class ModuleExamplePort implements IPort {
	usecaseParams: IUseCaseParams<any>;

	constructor(params: IPortParams) {
		this.usecaseParams = params;
	}

	getPublicUseCases(): IAllUseCases {
		return {};
	}

	get_test(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		const useCase = new TestUseCase(this.usecaseParams.services);
		return useCase.execute(info);
	}
}
