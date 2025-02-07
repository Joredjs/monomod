import { IPortContainer } from '@monomod/core/domain';

export const mockContainer = {
	hasRegistration: jest.fn(),
	register: jest.fn(),
	resolve: jest.fn(),
} as jest.Mocked<IPortContainer>;
