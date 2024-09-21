import { IErrResponse, setError } from '../../domain/result';
import { IExternalUseCaseParams } from '../../domain/useCases';
import { domainKeys } from '../../domain/keys/index';
export class ServiceUseCases {
	async requestExternal<TGReturn>(
		params: IExternalUseCaseParams
	): Promise<TGReturn> {
		const resultConsulta = await params.useCasesGroup[params.useCase].execute(
			params.info
		);

		const okCode = 200;
		if (
			!resultConsulta ||
			!resultConsulta.body ||
			resultConsulta.code !== domainKeys.httpCodes[okCode].code
		) {
			const resp: IErrResponse = resultConsulta as IErrResponse;
			if (resp.code && resp.error) {
				throw resp;
			}

			throw setError({
				errType: 'invalid',
				text: params.errorMsg,
			});
		}

		return resultConsulta.body as TGReturn;
	}
}
