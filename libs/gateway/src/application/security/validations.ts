import {
	EHttpMethods,
	IAppValidations,
	IJSONObject,
	IRequestParams,
	IResponseParams,
	IRoute,
	ISchema,
	IServices,
	ITransactionValid,
	TFrameworkRequest,
	TFrameworkResponse,
	TRouteSchema,
} from '@monomod/core/domain';
import { SecurityClass } from './security';
import { normalizeError } from '@monomod/core/application';
import { schemas } from '../../domain/schemas';

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

	#getBodyParams(route: IRoute, req: TFrameworkRequest<TFwReq>): IJSONObject {
		let params = req.body;
		if (Object.keys(req.params).length > 0) {
			params = { ...params, ...req.params };
		}

		if (route.method === EHttpMethods.GET) {
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
		const { route } = res.locals;

		const pathReplace = route.path.replace(/\//g, '_').replace(/:/g, '$');
		const path = `${route.method}_${pathReplace}`;

		let handler = this.#security.emptyHandler;

		if (route.businessPort && path && route.businessPort[path]) {
			handler = route.businessPort[path];
		}

		return {
			bodyParams: this.#getBodyParams(route, req),
			handler,
			reqHeader: req.headers,
			route,
			usecaseParams: route.businessPort.usecaseParams,
		};
	}

	#getSchemaVersion(route: IRoute): ISchema {
		let schema: TRouteSchema = route?.schema;

		if (route.method === EHttpMethods.GET) {
			if (!schema) {
				schema = schemas['pagination'];
			}
		}

		if (!schema) {
			throw normalizeError({
				detail: route.schema,
				errType: 'invalid',
				text: 'Check the schema for this route',
			});
		}

		const schemaVersion: ISchema = schema[route.version];

		if (!schemaVersion) {
			throw normalizeError({
				detail: route.version,
				errType: 'invalid',
				text: 'There is not schema for this version',
			});
		}

		return schemaVersion;
	}

	#validateParams(route: IRoute, bodyParams: IJSONObject): boolean {
		try {
			const schemaVersion: ISchema = this.#getSchemaVersion(route);

			const schemaKeys = Object.keys(schemaVersion).filter(
				(key) => !schemaVersion[key].optional
			);

			let vacio = false;
			for (const param of schemaKeys) {
				if (!bodyParams || bodyParams[param as string] === '') {
					vacio = true;
					break;
				}
			}
			if (vacio) {
				throw normalizeError({
					detail: bodyParams,
					errType: 'params',
					text: 'Empty or null parameters',
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
			const { route } = res.locals;
			if (!route.businessPort) {
				throw normalizeError({
					detail: route,
					errType: 'gone',
					text: 'The route is misconfigured',
				});
			}

			return true;
		}
		throw normalizeError({
			detail: res.locals,
			errType: 'gone',
			text: 'The framework is misconfigured',
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
				const { route } = res.locals;
				const bodyParams = this.#getBodyParams(route, req);
				return this.#validateParams(route, bodyParams);
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
