import { DIContainer } from './container';
import { normalizeError } from './errors';

export abstract class ModuleBase {
	static register(container: DIContainer): void {
		throw normalizeError({
			detail: 'Register method must be implemented',
			errType: 'badConfigured',
		});
	}
}
