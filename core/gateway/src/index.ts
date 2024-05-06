import { AppServiceLayers, PortsAdapter } from './application';
import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
} from '@nxms/core-main/domain';
import { RutaData, RutasEntity } from './domain';
import { ControllersAdapter } from './infra';

export class ApiCore<
	TFwParams,
	TFwReq extends IRequestParams,
	TFwRes extends IResponseParams
> {
	private controllers: ControllersAdapter<TFwReq, TFwRes>;

	private ports: PortsAdapter;

	private framework: IFrameworkService<TFwRes>;

	constructor(frameworkService: IFrameworkService<TFwRes>) {
		this.framework = frameworkService;
		this.controllers = new ControllersAdapter<TFwReq, TFwRes>(this.framework);
		this.ports = new PortsAdapter();
	}

	getRutas() {
		const rutaInfo = new RutaData<TFwParams>();
		const rutaEntity = new RutasEntity<TFwParams>(
			rutaInfo.routeList(),
			new AppServiceLayers<TFwReq, TFwRes>(
				this.controllers.getAll(),
				this.ports.getAll()
			)
		);
		return rutaEntity.getAll();
	}
}

