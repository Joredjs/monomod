export * from './interfaces.mock';
export * from './ports.mock';
export * from './services.mock';

export const mockConsole = {
	...global.console,
	debug: jest.fn(),
	error: jest.fn(),
	trace: jest.fn(),
};
