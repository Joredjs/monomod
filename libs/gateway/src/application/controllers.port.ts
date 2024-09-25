import { AppValidations, NoValidations } from './security';
import {
	IAppValidations,
	IController,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IServices,
	TControllers,
	TMyModulesInstances,
} from '@nxms/core/domain';
import { modulesList, modulos } from '../domain';

export class PortControllers<
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#framework: IFrameworkService<TFwRes>;

	#modulesInstances: TMyModulesInstances;

	constructor(
		frameworkService: IFrameworkService<TFwRes>,
		modulesInstances: TMyModulesInstances
	) {
		this.#framework = frameworkService;
		this.#modulesInstances = modulesInstances;
	}

	// Factory method to create a controller instance for a specific module
	#createController(module, services: IServices): IController<TFwReq, TFwRes> {
		// Determine which validation class to use based on module configuration
		const validations: IAppValidations<TFwReq, TFwRes> = modulos[module]
			.useValidations
			? new AppValidations<TFwReq, TFwRes>(services)
			: new NoValidations<TFwReq, TFwRes>(services);

		return new this.#modulesInstances[module].Controller<TFwReq, TFwRes>(
			validations,
			this.#framework
		);
	}

	getAll(services: IServices): TControllers<TFwReq, TFwRes> {
		const controllers: TControllers<TFwReq, TFwRes> = {};
		for (const module of modulesList) {
			controllers[module] = this.#createController(module, services);
		}

		return controllers;
	}
}
