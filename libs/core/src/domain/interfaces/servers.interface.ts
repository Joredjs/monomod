// TODO: Move to container
export interface IContainerComponent {
	token: symbol;
	value: any;
	isConstant?: boolean;
}

export interface IContainerAnalysis {
	cachedInstances: number;
	constants: number;
	registeredDependencies: number;
	unusedDependencies: string[];
	lazyResolutions: string[];
	lazyResolutionsDetails: {
		[token: string]: {
			timeAfterInit: number;
			stack: string;
		};
	};
}

export interface IContainerParameters {
	instances: Map<symbol, any>;
	constants: Map<symbol, any>;
	dependencies: Map<symbol, any>;
	lazyResolutions: Map<symbol, { time: number; stack: string }>;
	resolutionStack: Set<symbol>;
}

export interface IContainerInstaceParams<T> {
	instance: T;
	parameters: IContainerParameters;
}

export interface IServerConfig {
	addDomainName?: boolean;
	bodyLimit: string;
	debug?: {
		container?: boolean;
		cors?: boolean;
		paths?: boolean;
		routes?: boolean;
	};
}
