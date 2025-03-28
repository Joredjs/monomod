import { createMockMicroApp, createMockServer } from './mocks';
import { AdapterServerLocal } from '@monomod/server-local/application';
import {
	createMockIErrorMapping,
	mockPortErrors,
	mockPortLogs,
	mockPortMessages,
} from '@monomod/core/mocks';
import { IPortErrors, IPortLogs } from '@monomod/core/domain';

describe('AdapterServerLocal', () => {
	let adapter: AdapterServerLocal;
	let mockServer: ReturnType<typeof createMockServer>;

	beforeEach(() => {
		jest.resetAllMocks();
		mockServer = createMockServer();
		adapter = new AdapterServerLocal(mockPortLogs, mockPortErrors);
		Object.assign(adapter, {
			logs: mockPortLogs,
			messages: mockPortMessages,
			errors: mockPortErrors,
		});
	});

	describe('start', () => {
		it('should start microapp server successfully', async () => {
			const puerto = 3000;
			const microApp = createMockMicroApp('example', puerto);
			const listenMessage = `Server listening on port ${puerto}`;
			mockPortMessages.getMessage.mockReturnValue(listenMessage);

			await adapter.start(microApp);

			expect(microApp.app.listen).toHaveBeenCalledWith(
				microApp.httpPort,
				expect.any(Function)
			);
			// expect(mockLogs.debug).toHaveBeenCalledWith(listenMessage);
		});

		it('should throw error for invalid microapp', async () => {
			const invalidMicroApp = null;
			const errorMessage = 'Invalid microapp configuration';
			mockPortMessages.getMessage.mockReturnValue(errorMessage);

			try {
				await adapter.start(invalidMicroApp);
			} catch (err) {
				const errObj = createMockIErrorMapping('badConfigured');
				// expect(err).toMatchObject(errObj);
			}
		});

		// it('should handle server start errors', async () => {
		// 	const microApp = createMockMicroApp('example', 3000);
		// 	const error = 'Port in use';
		// 	microApp.app.listen.mockImplementation(() => {
		// 		throw error;
		// 	});

		// 	await expect(adapter.start(microApp)).rejects.toThrow(error);
		// });
	});

	describe('gracefulShutdown', () => {
		let originalProcessOn;
		let originalProcessExit;

		// beforeEach(() => {
		// 	originalProcessOn = process.on;
		// 	originalProcessExit = process.exit;
		// 	process.exit = jest.fn() as never;
		// });

		// afterEach(() => {
		// 	process.on = originalProcessOn;
		// 	process.exit = originalProcessExit;
		// });

		// it('should set up shutdown handlers', () => {
		// 	const serverName = 'testApp';
		// 	const shutdownMessage = 'Server shutting down';
		// 	mockMessages.getMessage.mockReturnValue(shutdownMessage);

		// 	const processOnMock = jest.fn();
		// 	process.on = processOnMock;

		// 	adapter.#gracefulShutdown(mockServer, serverName);

		// 	expect(processOnMock).toHaveBeenCalledWith(
		// 		'SIGINT',
		// 		expect.any(Function)
		// 	);
		// 	expect(processOnMock).toHaveBeenCalledWith(
		// 		'SIGTERM',
		// 		expect.any(Function)
		// 	);
		// });

		// it('should handle graceful shutdown correctly', async () => {
		// 	const serverName = 'testApp';
		// 	const shutdownMessage = 'Server stopped';
		// 	mockMessages.getMessage.mockReturnValue(shutdownMessage);

		// 	adapter.#gracefulShutdown(mockServer, serverName);

		// 	// Obtener el manejador de SIGINT
		// 	const processOnMock = jest.spyOn(process, 'on');
		// 	adapter.#gracefulShutdown(mockServer, serverName);
		// 	const shutdownHandler = processOnMock.mock.calls.find(
		// 		(call) => call[0] === 'SIGINT'
		// 	)?.[1] as Function;

		// 	// Simular cierre exitoso
		// 	mockServer.close.mockImplementation((cb) => cb());

		// 	// Ejecutar el manejador
		// 	await shutdownHandler();

		// 	expect(mockServer.close).toHaveBeenCalled();
		// 	// expect(mockLogs.debug).toHaveBeenCalledWith(shutdownMessage);
		// 	expect(process.exit).toHaveBeenCalledWith(0);
		// });

		// it('should handle shutdown errors', async () => {
		// 	const serverName = 'testApp';
		// 	const error = new Error('Shutdown error');
		// 	const errorMessage = 'Error during shutdown';
		// 	mockMessages.getMessage.mockReturnValue(errorMessage);

		// 	adapter.gracefulShutdown(mockServer, serverName);

		// 	const processOnMock = jest.spyOn(process, 'on');
		// 	adapter.gracefulShutdown(mockServer, serverName);
		// 	const shutdownHandler = processOnMock.mock.calls.find(
		// 		(call) => call[0] === 'SIGINT'
		// 	)?.[1] as Function;

		// 	mockServer.close.mockImplementation((cb) => cb(error));

		// 	await shutdownHandler();

		// 	expect(mockLogs.error).toHaveBeenCalledWith(errorMessage);
		// 	expect(process.exit).toHaveBeenCalledWith(1);
		// });
	});
});
