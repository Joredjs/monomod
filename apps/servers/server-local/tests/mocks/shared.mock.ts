import {
	IPortContainer,
	IPortLogs,
	IPortMessages,
	IPortErrors,
	IPortFrameworkAdapter,
	IPortServerAdapter,
	TErroresValues,
	IErrorMapping,
	IPortRegistry,
	IContainerComponent,
	IPortServerController,
} from '@monomod/core/domain';

export const createMockErrorMapping = (
	detail,
	errType: TErroresValues,
	text?
): jest.Mocked<IErrorMapping> => {
	const objErr: IErrorMapping = {
		detail,
		errType,
	};

	if (text) {
		objErr.text = text;
	}

	return objErr;
};

export const createMockLogs = (): jest.Mocked<IPortLogs> => ({
	saveError: jest.fn(),
	debug: jest.fn(),
	error: jest.fn(),
});

export const createMockErrors = (): jest.Mocked<IPortErrors> =>
	({
		normalize: jest.fn().mockImplementation((err) => err),
		// isIErrResponse: jest.fn(),
		// isIErrorMapping: jest.fn(),
	} as unknown as jest.Mocked<IPortErrors>);

export const createMockMessages = (): jest.Mocked<IPortMessages> => ({
	getMessage: jest.fn(),
	getContext: jest.fn(),
});

export const createMockContainer = (): jest.Mocked<IPortContainer> => {
	const container = {
		hasRegistration: jest.fn(),
		register: jest.fn(),
		resolve: jest.fn(),
	};

	// Configuraciones por defecto
	container.hasRegistration.mockReturnValue(false);
	container.register.mockReturnValue(undefined);
	container.resolve.mockReturnValue({});

	container.register.mockReturnValue(container);

	return container;
};

export const createMockFrameworkAdapter =
	(): jest.Mocked<IPortFrameworkAdapter> => ({
		getApps: jest.fn(),
	});

export const createMockServerAdapter = (): jest.Mocked<IPortServerAdapter> => ({
	start: jest.fn(),
});

export const createMockServerController =
	(): jest.Mocked<IPortServerController> => ({
		deploy: jest.fn(),
	});

// export const createMockRegistry = (
// 	name: string,
// 	container: IPortContainer,
// 	components: IContainerComponent[] = []
// ): jest.Mocked<IPortRegistry> => ({
// 	getName: jest.fn().mockReturnValue(name),
// 	registerDependency: jest.fn().mockImplementation(() => {
// 		components.forEach((component) => {
// 			if (!container.hasRegistration(component.token)) {
// 				container.register(component);
// 			}
// 		});
// 	}),
// });

export const createMockRegistry = (
	name: string,
	container: IPortContainer
): IPortRegistry => ({
	getName: jest.fn().mockReturnValue(name),
	registerDependency: jest.fn().mockReturnValue(container),
});

export const mockRegistry = {
	getName: jest.fn(),
	registerDependency: jest.fn(),
} as jest.Mocked<IPortRegistry>;
