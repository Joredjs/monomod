import {
	IMessageConfig,
	IServiceI18n,
	IServiceMessages,
	TOKENS,
} from '../../domain';
import { Inject } from '../../application';

export abstract class ServiceMessages implements IServiceMessages {
	constructor(
		@Inject(TOKENS.services.IServiceI18n)
		private i18n: IServiceI18n,
	) {}

	protected abstract getMessageConfig(): IMessageConfig;

	getMessage(key: string, params: any[]): string {
		const config = this.getMessageConfig();
		const llave = config.keys.find((myKey) => myKey.key === key);
		return this.i18n.getText({
			group: config.group,
			key: llave.key,
			params,
			type: llave.type,
		});
	}
}
