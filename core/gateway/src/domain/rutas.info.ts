import { IRouteGroup, domainKeys } from '@nxms/core-main/domain';

import { ExampleRoutes } from '@nxms/module-example/domain';

// TODO: mover las rutas a cada modulo

export class RutaData<TFwParams> {
	example: IRouteGroup<TFwParams>;

	// TODO: mapearlo al TDomainGroup

	constructor() {
		this.example = this.addGlobalCors(new ExampleRoutes<TFwParams>().rutas);
	}

	private addGlobalCors(rutas: IRouteGroup<TFwParams>) {
		rutas.cors.concat(domainKeys.core.globalCors);
		return rutas;
	}

	public routeList(): IRouteGroup<TFwParams>[] {
		return [this.example];
	}
}
