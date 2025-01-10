export const Inject = () => {
	return function (
		_target: any,
		_propertyKey: string,
		_parameterIndex: number
	) {
		// Mock implementation
	};
};

// Mock the entire module
jest.mock('@monomod/core/application', () => ({
	...jest.requireActual('@monomod/core/application'),
	Inject: Inject,
}));
