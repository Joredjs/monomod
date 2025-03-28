import { createMockMicroApp } from './mocks';
import { ControllerServerLocal } from '@monomod/server-local/infra';
import { IFrameworkMicroApp, IPortServerAdapter } from '@monomod/core/domain';
import {
	mockPortFrameworkAdapter,
	mockPortLogs,
	mockPortMessages,
	mockPortServerAdapter,
} from '@monomod/core/mocks';

describe('ControllerServerLocal', () => {
	let controller: ControllerServerLocal;
	let mockApps: Record<string, IFrameworkMicroApp>;

	beforeEach(() => {
		jest.resetAllMocks();
		controller = new ControllerServerLocal(
			mockPortServerAdapter,
			mockPortFrameworkAdapter,
			mockPortLogs
		);

		mockApps = {
			app1: createMockMicroApp('example', 9999),
			app2: createMockMicroApp('example', 9998),
		};

		Object.assign(controller, {
			logs: mockPortLogs,
			messages: mockPortMessages,
			frameworkAdapter: mockPortFrameworkAdapter,
			serverAdapter: mockPortServerAdapter,
		});
	});

	describe('deploy', () => {
		it('should successfully deploy all microapps', async () => {
			mockPortFrameworkAdapter.getApps.mockReturnValue(mockApps);

			await controller.deploy();

			expect(mockPortFrameworkAdapter.getApps).toHaveBeenCalled();
			expect(mockPortServerAdapter.start).toHaveBeenCalledTimes(2);
			expect(mockPortServerAdapter.start).toHaveBeenCalledWith(mockApps.app1);
			expect(mockPortServerAdapter.start).toHaveBeenCalledWith(mockApps.app2);
		});

		it('should handle framework adapter errors', async () => {
			const error = new Error('Framework error');
			mockPortFrameworkAdapter.getApps.mockImplementation(() => {
				throw error;
			});
			mockPortMessages.getMessage.mockReturnValue('Error message');

			await controller.deploy();

			// expect(mockLogs.error).toHaveBeenCalledWith('Error message');
		});

		it('should handle server adapter errors', async () => {
			mockPortFrameworkAdapter.getApps.mockReturnValue(mockApps);
			const error = new Error('Server error');
			mockPortServerAdapter.start.mockRejectedValue(error as never);
			mockPortMessages.getMessage.mockReturnValue('Error message');

			await controller.deploy();

			// expect(mockLogs.error).toHaveBeenCalledWith('Error message');
		});

		it('should handle empty apps list', async () => {
			mockPortFrameworkAdapter.getApps.mockReturnValue({});
			await controller.deploy();
			expect(mockPortServerAdapter.start).not.toHaveBeenCalled();
		});
	});
});
