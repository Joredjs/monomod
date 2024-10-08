import {
	EHttpMethods,
	IAppValidations,
	IJSONObject,
	IRequestParams,
	IResponseParams,
	IRuta,
	ISchema,
	IServices,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	TRutaSchema,
} from '@nxms/core/domain';
import { SecurityClass } from './security';
import { normalizeError } from '@nxms/core/application';

export class AppValidations<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> implements IAppValidations<TFwReq, TFwRes>
{
	#security: SecurityClass<TFwReq>;

	#schemaValidator;

	constructor(services: IServices) {
		this.#security = new SecurityClass<TFwReq>(services.headers);
		this.#schemaValidator = services.schema;
	}

	#getBodyParams(ruta: IRuta, req: TFrameworkRequest<TFwReq>): IJSONObject {
		let params = req.body;
		if (Object.keys(req.params).length > 0) {
			params = { ...params, ...req.params };
		}

		if (ruta.method === EHttpMethods.GET) {
			if (Object.keys(req.params).length > 0) {
				({ params } = req);
			} else {
				params = req.query;
			}

			for (const key in params) {
				if (params[key]) {
					const paramNumber = Number(params[key]);
					params[key] = isNaN(paramNumber) ? params[key] : paramNumber;
				}
			}
		}

		return params;
	}

	#validateRouteTransaction(info: ITransactionValid): boolean {
		return this.#security.validateRoute(info);
	}

	// Obtiene la info (locals) del req
	#getTransactionInfo(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): ITransactionValid {
		const ruta: IRuta = res.locals.route;

		const pathReplace = ruta.path.replace(/\//g, '_').replace(/:/g, '$');
		const path = `${ruta.method}_${pathReplace}`;

		let handler = this.#security.emptyHandler;

		if (ruta.port && path && ruta.port[path]) {
			handler = ruta.port[path];
		}

		return {
			bodyParams: this.#getBodyParams(ruta, req),
			handler,
			reqHeader: req.headers,
			ruta,
			usecaseParams: ruta.port.usecaseParams,
		};
	}

	#getSchemaVersion(ruta: IRuta): ISchema {
		const schema: TRutaSchema = ruta?.schema;

		if (!schema) {
			throw normalizeError({
				errType: 'invalid',
				text: 'No existe schema para esta ruta',
			});
		}

		const schemaVersion: ISchema = schema[ruta.version];

		if (!schemaVersion) {
			throw normalizeError({
				errType: 'invalid',
				text: 'No existe schema para esta version',
			});
		}

		return schemaVersion;
	}

	#validateParams(ruta: IRuta, bodyParams: IJSONObject): boolean {
		try {
			const schemaVersion: ISchema = this.#getSchemaVersion(ruta);

			const schemaKeys = Object.keys(schemaVersion).filter(
				(key) => !schemaVersion[key].optional
			);

			let vacio = false;
			for (const param of schemaKeys) {
				if (bodyParams[param as string] === '') {
					vacio = true;
					break;
				}
			}
			if (vacio) {
				throw normalizeError({
					detail: bodyParams,
					errType: 'params',
					text: 'Parametro vacio o inexistente',
				});
			}

			return this.#schemaValidator.validate(
				schemaVersion,
				schemaKeys,
				bodyParams
			);
		} catch (error) {
			throw normalizeError(error);
		}
	}

	#validateLocals(res: TFrameworkResponse<TFwRes>): boolean {
		if (res.locals.route) {
			const ruta: IRuta = res.locals.route;
			if (!ruta.port) {
				throw normalizeError({
					detail: ruta,
					errType: 'gone',
					text: 'Ruta mal configurada',
				});
			}

			return true;
		}
		throw normalizeError({
			detail: res.locals,
			errType: 'gone',
			text: 'Framework mal configurado',
		});
	}

	// Valida: Headers, locals y params
	#validateInitialTransaction(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): boolean {
		try {
			// Valida Headers

			const sec = this.#security.validateHeaders(req);

			// Valida locals del framework

			const locals = this.#validateLocals(res);

			// Valida los parametros

			if (sec && locals) {
				const ruta: IRuta = res.locals.route;
				const bodyParams = this.#getBodyParams(ruta, req);
				return this.#validateParams(ruta, bodyParams);
			}

			return false;
		} catch (error) {
			throw normalizeError(error);
		}
	}

	public manager(
		req: TFrameworkRequest<TFwReq>,
		res: TFrameworkResponse<TFwRes>
	): ITransactionValid {
		try {
			const resInitialValidations = this.#validateInitialTransaction(req, res);
			if (resInitialValidations) {
				const info = this.#getTransactionInfo(req, res);

				this.#validateRouteTransaction(info);

				return info;
			}

			return null;
		} catch (error) {
			throw normalizeError(error);
		}
	}
}
