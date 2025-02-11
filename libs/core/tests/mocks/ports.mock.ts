import { IPortLogs, IPortCrypto } from '@monomod/core/domain';

export const mockServiceCrypto: IPortCrypto = {
	encrypt: jest.fn(),
	decrypt: jest.fn(),
};

export const mockServiceLogs: IPortLogs = {
	debug: jest.fn(),
	error: jest.fn(),
	saveError: jest.fn(),
};

export const mockServiceHeaders = {
	validateMandatory: jest.fn(),
	validate: jest.fn(),
	validateRouteHeaders: jest.fn(),
	validateToken: jest.fn(),
};

export const mockResponseResult = {
	resultOk: jest.fn(),
	resultErr: jest.fn(),
	unwrap: jest.fn(),
};

export const mockServiceFramework = {
	returnInfo: jest.fn(),
};
