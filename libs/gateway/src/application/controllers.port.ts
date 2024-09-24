import {
	IController,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IServices,
	TControllers,
	TMyModulesInstances,
} from '@nxms/core/domain';
import { AppValidations } from './security';
import { modulesList } from '../domain';

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

	getAll(services: IServices): TControllers<TFwReq, TFwRes> {
		/* TODO: obetner las validaciones dinámicamente
		   TODO: O quitar el novalidations y dejar siempre obligatorio el appvalidations */
		const appValidations = new AppValidations<TFwReq, TFwRes>(services);

		const controllers: TControllers<TFwReq, TFwRes> = {};
		for (const module of modulesList) {
			const myController = this.#setModuleController(module, appValidations);
			controllers[module] = myController;
		}

		return controllers;
	}

	#setModuleController(module, validations): IController<TFwReq, TFwRes> {
		return new this.#modulesInstances[module].Controller<TFwReq, TFwRes>(
			validations,
			this.#framework
		);
	}
}
