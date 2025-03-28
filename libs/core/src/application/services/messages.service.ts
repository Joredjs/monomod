import {
	EMessageGroup,
	EMessageType,
	IMessageConfig,
	IPortI18n,
	IPortMessages,
	SYMBOLS,
} from '../../domain';
import { Inject, normalizeError } from '..';

// @Injectable(TOKENS.services.messages)
export abstract class ServiceMessages implements IPortMessages {
	@Inject(SYMBOLS.services.I18n)
	protected readonly i18n: IPortI18n;

	protected abstract getMessageConfig(): IMessageConfig;

	getMessage(key: string, params: any[]): string {
		const config = this.getMessageConfig();
		if (this.#validateMessage(config)) {
			const messageKey = config.keys.find((myKey) => myKey.key === key);
			if (!messageKey) {
				throw normalizeError({ detail: key, errType: 'badInfo' });
			}
			return this.i18n.getText({
				group: config.group,
				key: messageKey.key,
				params,
				type: messageKey.type,
			});
		}

		return '';
	}

	getContext(): EMessageGroup {
		const config = this.getMessageConfig();
		return config.group;
	}

	#validateMessage(config: IMessageConfig): boolean {
		if (!config || !config.group || !config.keys) {
			throw normalizeError({ detail: config, errType: 'badConfigured' });
		}

		if (!Object.values(EMessageGroup).includes(config.group)) {
			throw normalizeError({ detail: config.group, errType: 'badConfigured' });
		}

		if (!Array.isArray(config.keys) || config.keys.length === 0) {
			throw normalizeError({ detail: config.keys, errType: 'badConfigured' });
		}

		for (const key of config.keys) {
			if (!key.key || !Object.values(EMessageType).includes(key.type)) {
				throw normalizeError({ detail: key, errType: 'badConfigured' });
			}
		}

		return true;
	}
}
