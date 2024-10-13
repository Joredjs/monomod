import {
	IAllUseCases,
	IErrResponse,
	IOKResponse,
	IPort,
	IPortParams,
	ITransactionParams,
	IUseCase,
	IUseCaseParams,
} from '@nxms/core/domain';
import { UseCaseExampleErr, UseCaseExampleOk } from './useCases';

export class ModuleExamplePort implements IPort {
	usecaseParams: IUseCaseParams<any>;

	constructor(params: IPortParams) {
		this.usecaseParams = params;
	}

	getPublicUseCases(): IAllUseCases {
		return {};
	}

	get_testok(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		const useCase: IUseCase = new UseCaseExampleOk(this.usecaseParams);
		return useCase.execute(info);
	}

	get_testok_admin(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		const useCase: IUseCase = new UseCaseExampleOk(this.usecaseParams);
		return useCase.execute(info);
	}

	get_testerror(
		info: ITransactionParams
	): Promise<IOKResponse<string> | IErrResponse> {
		const useCase: IUseCase = new UseCaseExampleErr(this.usecaseParams);
		return useCase.execute(info);
	}
}
