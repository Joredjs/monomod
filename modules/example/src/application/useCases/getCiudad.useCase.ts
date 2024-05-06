import { ExampleRepository } from '../../domain';
import {
	IAppServices,
	IErrResponse,
	IOKResponse,
	ITransactionParams,
	IUseCase,
	resultErr,
	resultOk,
} from '@nxms/core-main/domain';
// import { GeneralDynamoRepository } from '../../infra';

export class GetCiudadUseCase implements IUseCase {
	private appServices: IAppServices;

	private repository: ExampleRepository;

	constructor(appServices: IAppServices) {
		this.appServices = appServices;

		// this.repository = new GeneralDynamoRepository(this.appServices.db.aws);
	}

	async execute(
		info: ITransactionParams
	): Promise<IOKResponse<any> | IErrResponse> {
		try {
			const resultCiudad = await this.repository.search({
				limit: 50,
				orderBy: '',
				start: 1,
			});
			if (!resultCiudad) {
				return resultErr({
					errType: 'noInfo',
					text: 'La informacion no existe',
				}).unwrap();
			}
			return resultOk(resultCiudad).unwrap();
		} catch (error) {
			throw resultErr(error).unwrap();
		}
	}
}
