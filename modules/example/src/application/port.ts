import {} from './useCases';
import {
	IAppServices,
	IErrResponse,
	IOKResponse,
	IPort,
	ITransactionParams,
} from '@nxms/core-main/domain';

export class ExamplePort implements IPort {
	appServices: IAppServices = {};

	constructor(appServices: IAppServices) {
		this.appServices = appServices;
	}

	// get_ciudades(
	// 	info: ITransactionParams
	// ): Promise<IOKResponse<ILocation[]> | IErrResponse> {
	// 	const useCase = new GetCiudadesUseCase(this.appServices);
	// 	return useCase.execute(info);
	// }
}
