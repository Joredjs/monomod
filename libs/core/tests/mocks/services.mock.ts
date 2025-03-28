import {
	IStorageClient,
	IUseCase,
} from '@monomod/core/domain';
import {
	mockPortCipher,
	mockPortCryptoClient,
	mockPortDatabase,
	mockPortDecipher,
} from './ports.mock';
import { MockValidateFunction } from './interfaces.mock';

// #region crypto
export const createMockCipher = (): jest.Mocked<typeof mockPortCipher> => ({
	...mockPortCipher,
	update: jest.fn().mockReturnValue(Buffer.from('encrypted')),
	getAuthTag: jest.fn().mockReturnValue(Buffer.from('auth-tag')),
});

export const createMockDecipher = (): jest.Mocked<typeof mockPortDecipher> => ({
	...mockPortDecipher,
	update: jest.fn().mockReturnValue('decrypted'),
	final: jest.fn().mockReturnValue(''),
});

export const createMockCryptoClient = (
	ciphers: string[],
	info: Record<string, any>,
	random: string
): jest.Mocked<typeof mockPortCryptoClient> => ({
	...mockPortCryptoClient,
	getCiphers: jest.fn().mockReturnValue(ciphers),
	getInfo: jest.fn().mockReturnValue(info),
	hash: jest.fn().mockReturnValue({
		update: jest.fn().mockReturnThis(),
		digest: jest.fn().mockReturnValue('mocked-hash'),
	}),
	random: jest.fn().mockReturnValue(Buffer.from(random)),
});
//#endregion

export const mockDb = {
	mydb: mockPortDatabase,
};

// export const createMockMessages = (): jest.Mocked<IPortMessages> =>
// 	mockPortMessages;

// export const createMockContainer = (): jest.Mocked<IPortContainer> =>
// 	mockPortContainer;

// export const createMockFrameworkAdapter =
// 	(): jest.Mocked<IPortFrameworkAdapter> => mockPortFrameworkAdapter;

export const mockTransporter = {
	sendMail: jest.fn(),
};

export const mockMailClient = {
	client: {
		createTransport: jest.fn().mockReturnValue(mockTransporter),
	},
};

export const mockI18n = {
	getText: jest.fn(),
	getCurrentLanguage: jest.fn(),
	setLanguage: jest.fn(),
};

export const mockValidate = jest.fn() as MockValidateFunction;
export const mockCompile = jest.fn().mockReturnValue(mockValidate);
const mockAjv = jest.fn(() => ({
	compile: mockCompile,
}));
export const mockSchemaClient = {
	Validator: mockAjv,
	defaultOptions: { allErrors: true, strict: false },
	errors: jest.fn(),
};

export const mockSend = jest.fn().mockResolvedValue({
	$metadata: { httpStatusCode: 200 },
	ETag: 'test-etag',
});

export const createMockStorageClient = (
	MockCommand
): jest.Mocked<IStorageClient> => ({
	Add: MockCommand,
	Get: MockCommand,
	List: MockCommand,
	Remove: MockCommand,
	Client: jest.fn().mockImplementation(() => ({
		send: mockSend,
	})),
});

export const createMockUseCase = (response): jest.Mocked<IUseCase<any>> => ({
	execute: jest.fn().mockResolvedValue(response),
});

export const mockValidations = {
	manager: jest.fn(),
};

export const mockTransactionInfo = {
	handler: jest.fn().mockResolvedValue({
		code: 200,
		body: 'success',
	}),
};
