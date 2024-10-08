import { IErrorMapping } from '../../domain/result';

export class ServiceLogs {
	save(errInfo: IErrorMapping) {
		/*  TODO: Use library for saving logs
       TODO: Obtain the params and headers info in the request */

		console.error('------ERROR:---------');
		console.trace(errInfo);
		console.error('----------------------');
	}
}
