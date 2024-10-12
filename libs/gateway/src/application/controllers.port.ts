import { AppValidations, NoValidations } from './security';
import {
	IAppValidations,
	IController,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IResponseResult,
	IServices,
	TControllers,
	TMyModulesInstances,
} from '@nxms/core/domain';
import { modulesList, modulos } from '../domain';
import { normalizeError } from '@nxms/core/application';

export class PortControllers<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;

	#modulesInstances: TMyModulesInstances;

	#response: IResponseResult;

	constructor(
		frameworkService: IFrameworkService<TFwRes>,
		modulesInstances: TMyModulesInstances,
		response: IResponseResult
	) {
		this.#framework = frameworkService;
		this.#modulesInstances = modulesInstances;
		this.#response = response;
	}

	// Factory method to create a controller instance for a specific module
	createController(module, services: IServices): IController<TFwReq, TFwRes> {
		// Determine which validation class to use based on module configuration
		const validations: IAppValidations<TFwReq, TFwRes> = modulos[module]
			.useValidations
			? new AppValidations<TFwReq, TFwRes>(services)
			: new NoValidations<TFwReq, TFwRes>(services);

		return new this.#modulesInstances[module].Controller<TFwReq, TFwRes>(
			validations,
			this.#framework,
			this.#response
		);
	}

	getAll(services: IServices): TControllers<TFwReq, TFwRes> {
		const controllers: TControllers<TFwReq, TFwRes> = {};
		for (const module of modulesList) {
			if (!this.#modulesInstances[module]) {
				throw normalizeError({
					detail: module,
					errType: 'invalid',
					text: 'The module instace doesn´t exists.',
				});
			}
			controllers[module] = this.createController(module, services);
		}

		return controllers;
	}
}
