import { ServerPort } from '../../src/application/server.port';
import { IServiceMessages } from '@monomod/core/domain';
import { IExpressMicroApp } from '@monomod/framework-express/domain';
import { Express } from 'express';

describe('ServerPort', () => {
	let serverPort: ServerPort;
	let mockMessages: jest.Mocked<IServiceMessages>;
	let mockApp: jest.Mocked<Express>;
	let mockServer: any;
	let processOnSpy: jest.SpyInstance;
	let processExitSpy: jest.SpyInstance;

	beforeEach(() => {
		mockMessages = {
			getMessage: jest.fn().mockReturnValue('test message'),
		} as unknown as jest.Mocked<IServiceMessages>;

		mockServer = {
			on: jest.fn(),
			close: jest.fn((cb) => cb()),
		};

		mockApp = {
			listen: jest.fn().mockReturnValue(mockServer),
		} as unknown as jest.Mocked<Express>;

		// Mock process.on and process.exit
		processOnSpy = jest
			.spyOn(process, 'on')
			.mockImplementation((event, handler) => {
				return process;
			});
		processExitSpy = jest
			.spyOn(process, 'exit')
			.mockImplementation(() => undefined as never);

		serverPort = new ServerPort(mockMessages);

		console.debug = jest.fn();
		console.error = jest.fn();
	});

	afterEach(() => {
		processOnSpy.mockRestore();
		processExitSpy.mockRestore();
	});

	it('should start server and listen on port', () => {
		const microApp: IExpressMicroApp = {
			app: mockApp,
			httpPort: 3000,
			name: 'example',
			cors: {
				dnsDomains: ['http://localhost'],
				localhostAllowed: true,
			},
		};

		serverPort.start(microApp);

		expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
		// Trigger the listen callback
		mockApp.listen.mock.calls[0][1]();
		expect(mockMessages.getMessage).toHaveBeenCalledWith('listen', [
			'example',
			3000,
		]);
	});

	it('should handle graceful shutdown', () => {
		const microApp: IExpressMicroApp = {
			app: mockApp,
			httpPort: 3000,
			name: 'example',
			cors: {
				dnsDomains: ['http://localhost'],
				localhostAllowed: true,
			},
		};

		serverPort.start(microApp);

		// Simulate SIGINT
		const [[event, handler]] = processOnSpy.mock.calls;
		expect(event).toBe('SIGINT');
		handler();

		expect(mockServer.close).toHaveBeenCalled();
		expect(mockMessages.getMessage).toHaveBeenCalledWith('stop', ['example']);
		expect(processExitSpy).toHaveBeenCalledWith(0);
	});
});
