import {
	IErrResponse,
	IExternalUseCaseParams,
	domainKeys,
} from '../../domain';
import { normalizeError } from '../errors';

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

			throw normalizeError({
				errType: 'invalid',
				text: params.errorMsg,
			});
		}

		return resultConsulta.body as TGReturn;
	}
}
