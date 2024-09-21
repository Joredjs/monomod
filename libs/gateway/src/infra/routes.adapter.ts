import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IRouteGroup,
	IServicesDependencies,
} from '@nxms/core/domain';
import { PortPorts, PortRoutes, ServiceLayers } from '../application';
import { AdapterControllers } from './controllers.adapter';

export class AdapterRoutes<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#routeList: IRouteGroup<TFwParams>[] = [];

	#layersService;

	constructor(
		frameworkService: IFrameworkService<TFwRes>,
		dependencies: IServicesDependencies
	) {
		const routePort = new PortRoutes<TFwParams>();
		const ports = new PortPorts(dependencies);
		const controllers = new AdapterControllers<TFwReq, TFwRes>(
			frameworkService
		);
		this.#routeList = routePort.routeList();
		this.#layersService = new ServiceLayers<TFwReq, TFwRes>(
			controllers.getAll(dependencies),
			ports.getAll()
		);
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
