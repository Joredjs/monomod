import {
	IPortCrypto,
	IPortContainer,
	IPortFrameworkService,
	IPortFrameworkAdapter,
	IPortFrameworkFactory,
	IPortFrameworkMiddleware,
	IPortLogs,
	IPortResponseResult,
	IPortServerAdapter,
	IPortDatabase,
	IPortMessages,
	IPortCryptoClient,
	IPortErrors,
} from '@monomod/core/domain';

// #region crypto
export const mockPortCrypto: jest.Mocked<IPortCrypto> = {
	encrypt: jest.fn(),
	decrypt: jest.fn(),
};

export const mockPortCryptoClient: jest.Mocked<IPortCryptoClient> = {
	encrypt: jest.fn(),
	decrypt: jest.fn(),
	hash: jest.fn(),
	random: jest.fn(),
	getCiphers: jest.fn(),
	getInfo: jest.fn(),
};

const mockPortCIpherStructure = {
	update: jest.fn(),
	final: jest.fn(),
	setAAD: jest.fn(),
};

export const mockPortCipher = {
	...mockPortCIpherStructure,
	getAuthTag: jest.fn(),
};

export const mockPortDecipher = {
	...mockPortCIpherStructure,
	setAuthTag: jest.fn(),
};
//#endregion

// #region db
export const mockPortDatabase: jest.Mocked<IPortDatabase> = {
	login: jest.fn(),
	getById: jest.fn(),
	getAll: jest.fn(),
	getByQuery: jest.fn(),
	add: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};
// #endregion

// #region errors
export const mockPortMessages: jest.Mocked<IPortMessages> = {
	getMessage: jest.fn(),
	getContext: jest.fn(),
};

export const mockPortErrors: jest.Mocked<IPortErrors> = {
	normalize: jest.fn(),
};

// #endregion

export const mockPortLogs: jest.Mocked<IPortLogs> = {
	debug: jest.fn(),
	error: jest.fn(),
	saveError: jest.fn(),
};

export const mockPortContainer: jest.Mocked<IPortContainer> = {
	clear: jest.fn(),
	complete: jest.fn(),
	hasRegistration: jest.fn(),
	resolve: jest.fn(),
	register: jest.fn(),
};

export const mockPortFrameworkService: jest.Mocked<IPortFrameworkService<any>> =
	{
		returnInfo: jest.fn(),
	};

export const mockPortFrameworkAdapter: jest.Mocked<IPortFrameworkAdapter> = {
	getApps: jest.fn(),
};

export const mockPortFrameworkFactory: jest.Mocked<IPortFrameworkFactory> = {
	createMicroApp: jest.fn(),
};

export const mockPortFrameworkMiddleware: jest.Mocked<
	IPortFrameworkMiddleware<any, any, any>
> = {
	notFound: jest.fn(),
	setDomainInfo: jest.fn(),
	setCors: jest.fn(),
	errorHandler: jest.fn(),
};

export const mockPortResponseResult: jest.Mocked<IPortResponseResult> = {
	resultOk: jest.fn(),
	resultErr: jest.fn(),
};

export const mockPortServerAdapter: jest.Mocked<IPortServerAdapter> = {
	start: jest.fn(),
};

export const mockServiceHeaders = {
	validateMandatory: jest.fn(),
	validate: jest.fn(),
	validateRouteHeaders: jest.fn(),
	validateToken: jest.fn(),
};
