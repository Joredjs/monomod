import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IRouteGroup,
	IServicesDependencies,
	TMyModuleList,
} from '@nxms/core/domain';
import { PortPorts, PortRoutes, ServiceLayers } from '../application';
import { AdapterControllers } from './controllers.adapter';
import { ExampleRoutes } from '@nxms/module-example/domain';
import { PortExample } from '@nxms/module-example/application';

export class AdapterRoutes<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	#routeList: IRouteGroup<TFwParams>[] = [];

	#modulesList: TMyModuleList = {};

	#layersService;

	constructor(
		frameworkService: IFrameworkService<TFwRes>,
		dependencies: IServicesDependencies
	) {
		this.#modulesList.example = { Port: PortExample, Route: ExampleRoutes };

		const routePort = new PortRoutes<TFwParams>(this.#modulesList);
		const ports = new PortPorts(dependencies, this.#modulesList);
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
