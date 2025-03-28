import { IPortServerAdapter } from '@monomod/core/domain';

export const createMockServerAdapter = (): jest.Mocked<IPortServerAdapter> => ({
	start: jest.fn(),
});
