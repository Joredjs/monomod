import { IContainerComponent, IContainerParameters } from '../interfaces';

export interface IPortContainer {
	clear(): void;
	complete(token: symbol): void;
	hasRegistration(token: symbol): boolean;
	register(component: IContainerComponent): void;
	resolve<T>(token: symbol): T;
}

export interface IPortContainerAnalyzer {
	analyze(parameters: IContainerParameters): void;
	resolutionGraph(
		parameters: IContainerParameters,
		token: symbol,
		depth?: number
	): void;
	resolve(
		parameters: IContainerParameters,
		token: symbol,
		isCompleted: boolean
	): void;
	register(component: IContainerComponent): void;
}

export interface IPortContainerRegistry {
	register(
		parameters: IContainerParameters,
		component: IContainerComponent
	): IContainerParameters;
	resolve<T>(
		parameters: IContainerParameters,
		token: symbol,
		isCompleted: boolean
	): { instance: T; parameters: IContainerParameters };
}
