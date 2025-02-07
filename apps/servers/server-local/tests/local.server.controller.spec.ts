import {
	createMockFrameworkAdapter,
	createMockLogs,
	createMockMessages,
	createMockMicroApp,
	createMockServerAdapter,
} from './mocks';
import { ControllerServerLocal } from '@monomod/server-local/infra';
import { IFrameworkMicroApp } from '@monomod/core/domain';

describe('ControllerServerLocal', () => {
	let controller: ControllerServerLocal;
	let mockLogs: ReturnType<typeof createMockLogs>;
	let mockMessages: ReturnType<typeof createMockMessages>;
	let mockFrameworkAdapter: ReturnType<typeof createMockFrameworkAdapter>;
	let mockServerAdapter: ReturnType<typeof createMockServerAdapter>;
	let mockApps: Record<string, IFrameworkMicroApp>;

	// let controller: ControllerServerLocal;
	// let mockMessages: MockMessagesService;
	// let mockFrameworkAdapter: MockFrameworkAdapter;
	// let mockServerAdapter: MockServerAdapter;

	beforeEach(() => {
		mockLogs = createMockLogs();
		mockMessages = createMockMessages();
		mockFrameworkAdapter = createMockFrameworkAdapter();
		mockServerAdapter = createMockServerAdapter();
		controller = new ControllerServerLocal(
			mockLogs,
			mockFrameworkAdapter,
			mockServerAdapter
		);

		mockApps = {
			app1: createMockMicroApp('example', 9999),
			app2: createMockMicroApp('example', 9998),
		};

		Object.assign(controller, {
			logs: mockLogs,
			messages: mockMessages,
			frameworkAdapter: mockFrameworkAdapter,
			serverAdapter: mockServerAdapter,
		});
		// (controller as any).logs = mockLogs;
		// (controller as any).messages = mockMessages;
		// (controller as any).frameworkAdapter = mockFrameworkAdapter;
		// (controller as any).serverAdapter = mockServerAdapter;
	});

	describe('deploy', () => {
		it('should successfully deploy all microapps', async () => {
			mockFrameworkAdapter.getApps.mockReturnValue(mockApps);

			await controller.deploy();

			expect(mockFrameworkAdapter.getApps).toHaveBeenCalled();
			expect(mockServerAdapter.start).toHaveBeenCalledTimes(2);
			expect(mockServerAdapter.start).toHaveBeenCalledWith(mockApps.app1);
			expect(mockServerAdapter.start).toHaveBeenCalledWith(mockApps.app2);
		});

		it('should handle framework adapter errors', async () => {
			const error = new Error('Framework error');
			mockFrameworkAdapter.getApps.mockImplementation(() => {
				throw error;
			});
			mockMessages.getMessage.mockReturnValue('Error message');

			await controller.deploy();

			// expect(mockLogs.error).toHaveBeenCalledWith('Error message');
		});

		it('should handle server adapter errors', async () => {
			mockFrameworkAdapter.getApps.mockReturnValue(mockApps);
			const error = new Error('Server error');
			mockServerAdapter.start.mockRejectedValue(error as never);
			mockMessages.getMessage.mockReturnValue('Error message');

			await controller.deploy();

			// expect(mockLogs.error).toHaveBeenCalledWith('Error message');
		});

		it('should handle empty apps list', async () => {
			mockFrameworkAdapter.getApps.mockReturnValue({});
			await controller.deploy();
			expect(mockServerAdapter.start).not.toHaveBeenCalled();
		});
	});
});
