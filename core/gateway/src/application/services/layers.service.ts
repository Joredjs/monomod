import { TControllers, TDomainGroups, TPorts } from '@nxms/core-main/domain';

export class AppServiceLayers<TFwReq, TFwRes> {
	private controllers: TControllers<TFwReq, TFwRes>;

	private ports: TPorts;

	constructor(Controllers: TControllers<TFwReq, TFwRes>, Ports: TPorts) {
		this.controllers = Controllers;
		this.ports = Ports;
	}

	getController(groupName: TDomainGroups) {
		return this.controllers[groupName];
	}

	getPort(groupName: TDomainGroups) {
		return this.ports[groupName];
	}
}

