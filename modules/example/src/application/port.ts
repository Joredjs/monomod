import { TestUseCase } from './useCases';
import {
	IAllUseCases,
	IErrResponse,
	IOKResponse,
	IPort,
	IPortParams,
	ITransactionParams,
	IUseCaseParams,
} from '@nxms/core-main/domain';

export class PortExample implements IPort {
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
