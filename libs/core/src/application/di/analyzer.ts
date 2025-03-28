import {
	IContainerAnalysis,
	IContainerComponent,
	IContainerParameters,
	IPortContainerAnalyzer,
} from '../../domain';

export class ContainerAnalyzer implements IPortContainerAnalyzer {
	#debugContainer: boolean;

	constructor(debugContainer: boolean) {
		this.#debugContainer = debugContainer;
	}

	analyze(parameters: IContainerParameters): void {
		const report: IContainerAnalysis = {
			cachedInstances: parameters.instances.size,
			constants: parameters.constants.size,
			lazyResolutions: [],
			lazyResolutionsDetails: {},
			registeredDependencies: parameters.dependencies.size,
			unusedDependencies: [] as string[],
		};

		// Encontrar dependencias no utilizadas
		parameters.dependencies.forEach((ind, token) => {
			if (!parameters.instances.has(token)) {
				report.unusedDependencies.push(token.toString());
			}
		});

		parameters.lazyResolutions.forEach((details, token) => {
			const tokenStr = token.toString();
			report.lazyResolutions.push(tokenStr);
			report.lazyResolutionsDetails[tokenStr] = {
				stack: details.stack,
				timeAfterInit: details.time,
			};
		});

		if (this.#debugContainer) {
			console.debug('Final Container Analysis:', {
				...report,
				lazyResolutionsDetails: Object.entries(
					report.lazyResolutionsDetails
				).map(([token, details]) => ({
					caller: details.stack.split('\n')[0],
					timeAfterInit: `${details.timeAfterInit}ms`,
					token,
				})),
			});
		}
	}

	resolutionGraph(
		parameters: IContainerParameters,
		token: symbol,
		depth = 0
	): void {
		const indent = '  '.repeat(depth);
		if (this.#debugContainer) {
			console.debug(`${indent}Resolving ${token.toString()}`);
		}

		const Implementation = parameters.dependencies.get(token);
		if (typeof Implementation === 'function' && Implementation.prototype) {
			const constructorParams =
				Reflect.getMetadata('design:paramtypes', Implementation) || [];
			constructorParams.forEach((tkn: any) => {
				this.resolutionGraph(parameters, tkn, depth + 1);
			});
		}
	}

	register(component: IContainerComponent): void {
		if (this.#debugContainer) {
			console.debug(`Registering: ${component.token.toString()}`, {
				isConstant: component.isConstant,
				name: component.value?.name || 'anonymous',
				type: typeof component.value,
			});
		}
	}

	resolve(
		parameters: IContainerParameters,
		token: symbol,
		isComplete: boolean
	): void {
		const stack = new Error().stack?.split('\n');
		const caller = stack?.[3]?.trim() || 'unknown';
		const phase = isComplete ? 'lazy' : 'init';

		if (this.#debugContainer) {
			console.debug(`Resolving: ${token.toString()}`, {
				caller,
				fromCache:
					parameters.instances.has(token) || parameters.constants.has(token),
				phase,
				time: new Date().toISOString(),
			});
		}
	}
}
