import { HTTPCODES, IErrResponse, IExternalUseCaseParams } from '../../domain';
import { normalizeError } from '../errors';

export class ServiceUseCases {
	async requestExternal<TGReturn>(
		params: IExternalUseCaseParams
	): Promise<TGReturn> {
		const useCaseExists = Boolean(params.useCasesGroup[params.useCase]);

		if (!useCaseExists) {
			throw normalizeError({
				detail: `No existe el caso de uso '${params.useCase}'`,
				errType: 'invalid',
				text: params.errorMsg,
			});
		}

		const resultConsulta = await params.useCasesGroup[params.useCase].execute(
			params.info
		);

		const okCode = 200;
		if (
			!resultConsulta ||
			!resultConsulta.body ||
			resultConsulta.code !== HTTPCODES[okCode].code
		) {
			const resp: IErrResponse = resultConsulta as IErrResponse;
			if (resp.code && resp.error) {
				throw resp;
			}

			throw normalizeError({
				detail: resp,
				errType: 'invalid',
				text: params.errorMsg,
			});
		}

		return resultConsulta.body as TGReturn;
	}
}
