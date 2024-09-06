import {
	IRequestParams,
	IResponseParams,
	IRouteGroup,
	TControllers,
	TPorts,
} from '@nxms/core-main/domain';
import { PortRoutes, ServiceLayers } from '../application';

export class AdapterRoutes<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#routeList: IRouteGroup<TFwParams>[] = [];
	#layersService;

	constructor(controllers: TControllers<TFwReq, TFwRes>, ports: TPorts) {
		const routePort = new PortRoutes<TFwParams>();
		this.#routeList = routePort.routeList();
		this.#layersService = new ServiceLayers<TFwReq, TFwRes>(controllers, ports);
	}

	getAll(): IRouteGroup<TFwParams>[] {
		this.#routeList.map((rgroup) => {
			rgroup.handler = this.#layersService.getController(rgroup.group).handler;
			rgroup.port = this.#layersService.getPort(rgroup.group);
			return rgroup;
		});
		return this.#routeList;
	}
}
