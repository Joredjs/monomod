import { IRouteGroup } from '@nxms/core-main/domain';

export class RutasEntity<TFwParams> {
	private routeList: IRouteGroup<TFwParams>[] = [];

	private layersService;

	constructor(rutas: IRouteGroup<TFwParams>[], layersService) {
		this.routeList = rutas;
		this.layersService = layersService;
	}

	getAll(): IRouteGroup<TFwParams>[] {
		// Return this.lista;
		this.routeList.map((rgroup) => {
			rgroup.handler = this.layersService.getController(rgroup.group).handler;
			rgroup.port = this.layersService.getPort(rgroup.group);
			return rgroup;
		});
		return this.routeList;
	}
}

