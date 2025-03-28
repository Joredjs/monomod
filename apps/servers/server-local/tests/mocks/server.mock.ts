import { IFrameworkMicroApp, TDomainGroups } from '@monomod/core/domain';

export const createMockServer = () => ({
	listen: jest.fn((port, callback) => {
		if (callback) callback();
		return createMockServer();
	}),
	on: jest.fn(),
	close: jest.fn(),
	use: jest.fn(),
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
	all: jest.fn(),
});

//TODO: move to the framework lib
export const createMockMicroApp = (
	name: TDomainGroups,
	port: number,
	localhostAllowed = true
): IFrameworkMicroApp => ({
	app: createMockServer(),
	cors: {
		dnsDomains: ['https://test.domain.com'],
		localhostAllowed,
		noOriginAllowed: false,
	},
	httpPort: port,
	name,
});
