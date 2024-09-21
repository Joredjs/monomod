import { TControllers, TDomainGroups, TPorts } from '@nxms/core/domain';

export class ServiceLayers<TFwReq, TFwRes> {
	#controllers: TControllers<TFwReq, TFwRes>;

	#ports: TPorts;

	constructor(Controllers: TControllers<TFwReq, TFwRes>, Ports: TPorts) {
		this.#controllers = Controllers;
		this.#ports = Ports;
	}

	getController(groupName: TDomainGroups) {
		return this.#controllers[groupName];
	}

	getPort(groupName: TDomainGroups) {
		return this.#ports[groupName];
	}
}
