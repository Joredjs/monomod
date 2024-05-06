import {
	EHttpMethods,
	IAppValidations,
	IErrResponse,
	IHeadersValues,
	IJSONObject,
	IRequestParams,
	IResponseParams,
	IRuta,
	ISchema,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	TResult,
	resultErr,
	resultOk,
} from '@nxms/core-main/domain';
import { AppServiceSchemaValidator } from '../services';
import { SecurityClass } from './security';

export class AppValidations<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> implements IAppValidations<TFwReq, TFwRes>
{
	private security: SecurityClass<TFwReq>;

	private schemaValidator;

	constructor() {
		this.security = new SecurityClass<TFwReq>();
		this.schemaValidator = AppServiceSchemaValidator.getInstance();
	}

	private getBodyParams(
		ruta: IRuta,
		req: TFrameworkRequest<TFwReq>
	): IJSONObject {
		let params = req.body;
		if (ruta.method === EHttpMethods.GET) {
			if (Object.keys(req.params).length > 0) {
				({ params } = req);
			} else {
				params = req.query;
			}
		}
		return params;
	}

	private validateRouteTransaction(
		info: ITransactionValid
	): TResult<IHeadersValues, IErrResponse> {
		const sec = this.security.validateRoute(info);
		if (sec.isErr()) {
			return sec;
		}
		return resultOk<any>(sec.unwrap());
	}

	private getTransactionInfo(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): ITransactionValid {
		const ruta: IRuta = res.locals.route;

		// TODO: recibir parametros dinamicos (x/:id)

		const path = `${ruta.method}_${ruta.path.replace(/\//g, '_')}`;

		let useCase = this.security.emptyUseCase;
		if (ruta.port && path && ruta.port[path]) {
			useCase = ruta.port[path];
		}

		const appServices = ruta.port.appServices ? ruta.port.appServices : {};

		return {
			appServices,
			bodyParams: this.getBodyParams(ruta, req),
			reqHeader: req.headers,
			ruta,
			useCase,
		};
	}

	private validateParams(
		ruta: IRuta,
		bodyParams: IJSONObject
	): TResult<string, IErrResponse> {
		// Const rutaschema: TRutaSchema = ruta.schema || {};

		const schema: ISchema = ruta.schema[ruta.version];

		if (!schema) {
			return resultErr({
				errType: 'invalid',
				text: 'No existe schema para esta versión',
			});
		}

		const schemaKeys = Object.keys(schema);

		let vacio = false;
		for (const param of schemaKeys) {
			if (bodyParams[param as string] === '') {
				vacio = true;
				break;
			}
		}
		if (vacio) {
			return resultErr({
				detail: bodyParams,
				errType: 'params',
				text: 'Parametro vacio o inexistente',
			});
		}

		const schemaValid = this.schemaValidator.validate(
			schema,
			schemaKeys,
			bodyParams
		);
		if (schemaValid.isErr()) {
			return schemaValid;
		}

		return resultOk();
	}

	private validateLocals(
		res: TFrameworkResponse<TFwRes>
	): TResult<string, IErrResponse> {
		if (res.locals.route) {
			const ruta: IRuta = res.locals.route;
			if (!ruta.port) {
				return resultErr({
					detail: ruta,
					errType: 'gone',
					text: 'Ruta mal configurada',
				});
			}

			return resultOk();
		}
		return resultErr({
			detail: res.locals,
			errType: 'gone',
			text: 'Framework mal configurado',
		});
	}

	private validateInitialTransaction(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): TResult<string, IErrResponse> {
		// Valida Headers

		const sec = this.security.validateHeaders(req);
		if (sec.isErr()) {
			return sec;
		}

		// Valida locals del framework

		const locals = this.validateLocals(res);
		if (locals.isErr()) {
			return locals;
		}

		// Valida los parametros

		const ruta: IRuta = res.locals.route;
		const bodyParams = this.getBodyParams(ruta, req);
		const validateParams = this.validateParams(ruta, bodyParams);

		if (validateParams.isErr()) {
			return validateParams;
		}

		return resultOk();
	}

	public manager(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): TResult<any, IErrResponse> {
		// Valida: Headers, locals y params

		const resInitialValidations = this.validateInitialTransaction(req, res);
		if (resInitialValidations.isErr()) {
			return resInitialValidations;
		}

		// Obtiene la info (locals) del req

		const info = this.getTransactionInfo(req, res);

		const resRouteValidations = this.validateRouteTransaction(info);

		if (resRouteValidations.isErr()) {
			return resRouteValidations;
		}

		return resultOk(info);
	}
}

