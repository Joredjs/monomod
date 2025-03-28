import { ServiceLogs } from '@monomod/core/application';
import { createMockIErrorMapping, mockConsole } from '../../mocks';
import { mockPortMessages } from '../../mocks';
import { EMessageGroup } from '@monomod/core/domain';

describe('ServiceLogs', () => {
	let service: ServiceLogs;

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock console methods
		global.console = mockConsole;

		mockPortMessages.getContext.mockReturnValue(EMessageGroup.SYSTEM);
		mockPortMessages.getMessage.mockReturnValue('test message');

		service = new ServiceLogs(mockPortMessages);
	});

	describe('saveError', () => {
		it('should log error information correctly', () => {
			const errorInfo = createMockIErrorMapping('invalid');

			service.saveError(errorInfo);

			expect(console.error).toHaveBeenCalledWith('------ERROR:---------');
			expect(console.trace).toHaveBeenCalledWith(errorInfo);
			expect(console.error).toHaveBeenCalledWith('----------------------');
		});
	});

	describe('debug', () => {
		it('should log debug message with context and metadata', () => {
			const logInfo = {
				text: 'debug message',
				detail: { key: 'value' },
			};

			service.debug(logInfo);

			expect(mockPortMessages.getContext).toHaveBeenCalled();
			expect(console.debug).toHaveBeenCalled();
			// Verificar que el log incluye el contexto y el mensaje
			const logCall = (console.debug as jest.Mock).mock.calls[0];
			expect(logCall[0]).toContain('[debug]');
			expect(logCall[0]).toContain('debug message');
			expect(logCall[1]).toEqual(logInfo.detail);
		});

		it('should handle log info without detail', () => {
			const logInfo = {
				text: 'debug message',
			};

			service.debug(logInfo);

			expect(console.debug).toHaveBeenCalled();
			const logCall = (console.debug as jest.Mock).mock.calls[0];
			expect(logCall[1]).toBe('');
		});

		it('should use getMessage when messageKey is provided', () => {
			const logInfo = {
				messageKey: 'test.key',
				messageParams: ['param1', 'param2'],
			};

			service.debug(logInfo);

			expect(mockPortMessages.getMessage).toHaveBeenCalledWith(
				logInfo.messageKey,
				logInfo.messageParams
			);
		});
	});

	describe('error', () => {
		it('should log error message with context and metadata', () => {
			const logInfo = {
				text: 'error message',
				detail: { key: 'value' },
			};

			service.error(logInfo);

			expect(mockPortMessages.getContext).toHaveBeenCalled();
			expect(console.error).toHaveBeenCalled();
			// Verificar que el log incluye el contexto y el mensaje
			const logCall = (console.error as jest.Mock).mock.calls[0];
			expect(logCall[0]).toContain('[error]');
			expect(logCall[0]).toContain('error message');
			expect(logCall[1]).toEqual(logInfo.detail);
		});

		it('should handle error info without detail', () => {
			const logInfo = {
				text: 'error message',
			};

			service.error(logInfo);

			expect(console.error).toHaveBeenCalled();
			const logCall = (console.error as jest.Mock).mock.calls[0];
			expect(logCall[1]).toBe('');
		});

		it('should use getMessage when messageKey is provided', () => {
			const logInfo = {
				messageKey: 'test.key',
				messageParams: ['param1', 'param2'],
			};

			service.error(logInfo);

			expect(mockPortMessages.getMessage).toHaveBeenCalledWith(
				logInfo.messageKey,
				logInfo.messageParams
			);
		});
	});

	describe('Log Format', () => {
		it('should format log entries correctly', () => {
			const logInfo = {
				text: 'test message',
				detail: { data: 'test' },
			};

			service.debug(logInfo);

			const logCall = (console.debug as jest.Mock).mock.calls[0];
			// Verificar formato: [timestamp] [level] [context] message
			expect(logCall[0]).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[debug\] \[system\] test message/
			);
		});

		it('should handle undefined context', () => {
			mockPortMessages.getContext.mockReturnValue(undefined);

			const logInfo = {
				text: 'test message',
			};

			service.debug(logInfo);

			const logCall = (console.debug as jest.Mock).mock.calls[0];
			// Verificar que el log se formatea correctamente sin contexto
			expect(logCall[0]).toMatch(
				/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[debug\] \[nocontext\] test message/
			);
		});
	});
});
